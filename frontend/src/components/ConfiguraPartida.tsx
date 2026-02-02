import { EDificuldade } from "jogodaforca-shared";
import { useEffect, useState } from "react";
import { obterTemas } from "../api/tema";
import Select, { type OptionProps } from "./Select";
import { alert } from "../utils/alert";
import { Button } from "./Button";
import { Sparkles, List } from "lucide-react";
import { armazenamentoLocal } from "../utils/local_storage";

export function ConfiguraPartida({ iniciarPartidaCallback, cancelarCallback, partidaViaIACallback }: ModalConfiguraPartidaProps) {
    const [dificuldade, setDificuldate] = useState<EDificuldade | "">("")
    const [idTema, setIdTema] = useState<string>("")
    const [temas, setTemas] = useState<OptionProps[]>([]);
    const [modoIA, setModoIA] = useState(false);
    const [temaIA, setTemaIA] = useState("");

    function verificarIaDisponivel() {
        const iaDisponivel = armazenamentoLocal({
            acao: "obter",
            chave: "iaDisponivel",
        });
        return iaDisponivel === "true";
    }
    const dificuldades: OptionProps[] = Object.values(EDificuldade).map((dificuldade) => ({ valor: dificuldade, texto: dificuldade }));


    function iniciarPartida() {
        if (modoIA) {
            if (!temaIA || temaIA.trim() === "") {
                alert(400, "Configurar Partida", "Por favor, digite um tema para gerar com IA.");
                return;
            }
            if (partidaViaIACallback) {
                partidaViaIACallback(temaIA);
            }
            return;
        }

        if (!dificuldade || !idTema || idTema.trim() === "" || dificuldade.trim() === "") {
            alert(400, "Configurar Partida", "Por favor, selecione a dificuldade e o tema para iniciar a partida.");
            return;
        }
        if (isNaN(Number(idTema))) {
            alert(400, "Configurar Partida", "ID do tema inválido.");
            return;
        }
        iniciarPartidaCallback(dificuldade, parseInt(idTema));
    }

    function selecionar(type: 'dificuldade' | 'tema') {
        if (type === 'dificuldade') {
            return (valor: string) => setDificuldate(valor as EDificuldade);
        }
        return (valor: string) => setIdTema(valor);
    }

    useEffect(() => {
        const fetchTemas = async () => {
            const temas = await obterTemas()
            if (temas) {
                const values: OptionProps[] = temas.map((tema) => ({ valor: tema.id, texto: tema.valor }));
                setTemas(values);
            }

        }
        fetchTemas();
    }, []);

    return (
        <div className="modal">
            <div className="modal-box min-h-[320px]">
                <h3 className="font-bold text-lg mb-4">Configurar Partida</h3>

                {/* Menu de seleção de modo */}
                <div className="flex gap-2 mb-6 p-1 bg-secondary rounded-lg">
                    <button
                        onClick={() => setModoIA(false)}
                        className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-md transition-all ${!modoIA
                            ? 'bg-primary text-primary-foreground shadow-md'
                            : 'text-muted-foreground hover:text-foreground'
                            }`}
                    >
                        <List className="w-4 h-4" />
                        <span className="font-display font-medium">Temas Cadastrados</span>
                    </button>
                    <button
                        disabled={!verificarIaDisponivel()}
                        onClick={() => setModoIA(true)}
                        className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-md transition-all ${modoIA
                            ? 'bg-accent text-accent-foreground shadow-md'
                            : 'text-muted-foreground hover:text-foreground'
                            }`}
                    >
                        <Sparkles className="w-4 h-4" />
                        <span className="font-display font-medium">Gerar com IA</span>
                    </button>
                </div>

                {/* Formulário condicional */}
                {modoIA ? (
                    <div className="space-y-3 mb-4">
                        <label className="block">
                            <span className="text-sm font-medium text-foreground mb-2 block">
                                Digite um tema para gerar palavra
                            </span>
                            <input
                                type="text"
                                placeholder="Ex: Animais, Tecnologia, Esportes..."
                                value={temaIA}
                                onChange={(e) => setTemaIA(e.target.value)}
                                className="input input-bordered w-full h-14 text-base px-4"
                            />
                        </label>
                        <p className="text-xs text-muted-foreground leading-relaxed mt-2">
                            A IA gerará uma palavra e dicas baseadas neste tema
                        </p>
                    </div>
                ) : (
                    <>
                        <div className="form-control mb-4">
                            <label className="label">
                            </label>
                            <Select opcoes={temas} aoAlterar={selecionar('tema')} label="Selecione o tema" valorSelecionado={idTema} />
                        </div>
                        <div className="form-control mb-4">
                            <label className="label">
                            </label>
                            <Select opcoes={dificuldades} aoAlterar={selecionar('dificuldade')} label="Selecione a dificuldade" valorSelecionado={dificuldade} />
                        </div>
                    </>
                )}

                <div className="flex mt-6 justify-end">
                    <Button onClick={iniciarPartida} label="Iniciar Partida" className="btn-accent flex-1 px-6 py-4 text-lg font-display gap-2 min-w-[200px] outline lg" />
                    <Button onClick={cancelarCallback} label="Cancelar" className="btn-ghost px-6 py-4 text-lg font-display gap-2 min-w-[200px] outline lg ml-4" />
                </div>
            </div>
        </div>
    );

}

type ModalConfiguraPartidaProps = {
    iniciarPartidaCallback: (dificuldade: EDificuldade, idTema: number) => void;
    partidaViaIACallback?: (tema: string) => void;
    cancelarCallback?: () => void;
}