import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { Header } from "../components/Header";
import { useUsuario, type UsuarioHook } from "../hooks/usuario";
import { obterUUID } from "../utils/gerarUUID";
import { useSocket } from "../hooks/socket";
import { useEffect, useState } from "react";
import { Carregando } from "../components/Carregando";
import { Modal } from "../components/Modal";
import { Button } from "../components/Button";
import { armazenamentoLocal } from "../utils/local_storage";
import { alert } from "../utils/alert";
import type { EDificuldade } from "jogodaforca-shared";

export function Layout() {
    obterUUID();
    const hookUsuario = useUsuario();
    const realTimeSocket = useSocket(hookUsuario.usuario);
    const location = useLocation();
    const nav = useNavigate();
    const [displayLocation, setDisplayLocation] = useState(location);
    const [transitionStage, setTransitionStage] = useState("fadeIn");
    const [jogoId, setJogoId] = useState(() => {
        const jogoId = armazenamentoLocal({
            acao: "obter",
            chave: "jogoId",
        });
        if (isNaN(Number(jogoId)) || !jogoId) {
            return null;
        }
        return Number(jogoId);
    });



    function restaurarJogoAberto(decisao: boolean) {
        if (!jogoId) return
        if (decisao) {
            realTimeSocket.solicitarRestaurarJogo(jogoId)
            nav("/jogar");
            setJogoId(null)
            return
        }
        armazenamentoLocal({
            acao: "remover",
            chave: "jogoId",
        })

        realTimeSocket.finalizarJogo(jogoId)
        setJogoId(null)
    }

    function partidaViaIA(tema: string) {
        if (hookUsuario.usuario) {
            const idUsuario = hookUsuario.usuario.id;
            realTimeSocket.novoJogoTemaIA(tema, idUsuario);
            nav("/jogar");
            return;
        }
    }

    function iniciarPartida(dificuldade: EDificuldade, temaId: number) {
        if (hookUsuario.usuario) {
            const idUsuario = hookUsuario.usuario.id;
            realTimeSocket.novoJogo({
                dificuldade,
                idUsuario,
                temaId
            });
            nav("/jogar");
            return;
        }
        alert(400, "Nova Partida", "Recarregue a página para autenticar o usuário ou faça login.");
    }

    useEffect(() => {
        if (location.pathname !== displayLocation.pathname) {
            function fadeOut() {
                setTransitionStage("fadeOut");
            }
            fadeOut();
            const timer = setTimeout(() => {
                setTransitionStage("fadeIn");
                setDisplayLocation(location);
            }, 300); // Apenas tempo da animação CSS
            return () => clearTimeout(timer);
        }
    }, [location, displayLocation]);

    return (
        <>
            {realTimeSocket.isLoading && <Carregando />}
            <Header usuario={hookUsuario.usuario} />
            {!jogoId ? null :
                <Modal onClose={() => setJogoId(null)}>
                    <div className="p-6">
                        <h2 className="text-2xl font-semibold mb-4">Bem vindo de volta: {hookUsuario.usuario?.nome.toLowerCase().startsWith("guest") ? "Convidado" : hookUsuario.usuario?.nome}</h2>
                        <p className="mb-2">Notamos que há um jogo em aberto, deseja Continuar?</p>
                        <Button className="btn-primary mr-2" label="Continuar Jogo" onClick={() => { restaurarJogoAberto(true) }} />
                        <Button className="btn-secondary" label="cancelar" onClick={() => { restaurarJogoAberto(false) }} />
                    </div>
                </Modal>}
            <main className={`container mx-auto px-4 py-6 flex-auto route-transition-${transitionStage}`}>
                <Outlet context={{ usuario: hookUsuario, realTimeSocket, partidaViaIA, iniciarPartida }} key={displayLocation.pathname} />
            </main>
        </>
    );
}

export type LayoutOutletContext = {
    usuario: UsuarioHook;
    realTimeSocket: ReturnType<typeof useSocket>;
    iniciarPartida: (dificuldade: EDificuldade, temaId: number) => void;
    partidaViaIA: (tema: string) => void;
}