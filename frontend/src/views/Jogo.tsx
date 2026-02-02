import { Forca } from "../components/Forca";
import { Teclado } from "../components/Teclado";
import { useJogo } from "../hooks/jogo";
import { Palavra } from "../components/Palavra";
import { EEstadoDeJogo } from "jogodaforca-shared";
import { useNavigate, useOutletContext } from "react-router-dom";
import type { LayoutOutletContext } from "./Layout";
import { useEffect, useState } from "react";
import { Vida } from "../components/Vida";
import { JogarNovamente } from "../components/JogarNovamente";
import { Dica } from "../components/Dica";
import { Score } from "../components/Score";
import { ConfiguraPartida } from "../components/ConfiguraPartida";
import { Modal } from "../components/Modal";
import { Ranking } from "./Ranking";


export function Jogo() {
    const { realTimeSocket, iniciarPartida, partidaViaIA } = useOutletContext<LayoutOutletContext>();
    const { cliclarLetra, estadoDoJogo, letrasCorretas, letrasIncorretas, } = useJogo(realTimeSocket);
    const [mostrarModal, setMostrarModal] = useState(false);
    const [novaPartida, setNovaPartida] = useState(false);

    const nav = useNavigate();

    function calcularVidasRestantes() {
        if (!estadoDoJogo) return 0;
        return estadoDoJogo.maxTentativas - estadoDoJogo.letrasErradas.length;
    }

    function fecharModal() {
        setMostrarModal(false);
        nav("/");
    }

    function jogarNovamente() {
        setNovaPartida(true);
        setMostrarModal(false);
    }

    function voltarParaInicio() {
        setNovaPartida(false);
        setMostrarModal(false);
        nav("/");
    }


    useEffect(() => {
    }, [estadoDoJogo]);

    if (!estadoDoJogo) {
        return <Ranking />;
    }

    return (

        <div>
            <JogarNovamente
                estadoDoJogo={estadoDoJogo.estado}
                mostrarModal={estadoDoJogo.estado !== EEstadoDeJogo.ATIVO || mostrarModal}
                resposta={estadoDoJogo.palavra.join("")}
                jogarNovamenteCallback={jogarNovamente}
                cancelarCallback={fecharModal}
            />
            {novaPartida &&
                <Modal onClose={() => setNovaPartida(false)}>
                    <ConfiguraPartida
                        iniciarPartidaCallback={iniciarPartida}
                        partidaViaIACallback={partidaViaIA}
                        cancelarCallback={voltarParaInicio} />
                </Modal>}

            <div className="flex flex-col items-center justify-center gap-10 mb-8">
                <div className="flex gap-4">

                    <Forca tentativas={estadoDoJogo.letrasErradas.length} tentativasMax={estadoDoJogo.maxTentativas} />
                    <div className="flex flex-col gap-6">
                        <Vida vidas={calcularVidasRestantes()} vidasMax={estadoDoJogo.maxTentativas} />
                        <Score pontuacao={estadoDoJogo.pontuacaoAtual} />
                        <Dica dicas={estadoDoJogo.dicasUtilizadas} pegarDicaCallback={realTimeSocket.pedirHint} isLoading={realTimeSocket.isLoadingHint} />
                    </div>

                </div>
                <Palavra letras={estadoDoJogo.palavra} gameOver={estadoDoJogo.estado === EEstadoDeJogo.DERROTA} />
            </div>
            <Teclado letrasCorretas={new Set(letrasCorretas)} letrasErradas={new Set(letrasIncorretas)} pressionarTecla={cliclarLetra} />
        </div>
    );
}