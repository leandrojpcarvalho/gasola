import { EEstadoDeJogo } from "jogodaforca-shared";
import { Modal } from "./Modal";
import { Button } from "./Button";

export function JogarNovamente({ estadoDoJogo, resposta, mostrarModal, jogarNovamenteCallback, cancelarCallback = () => { } }: ModalConfiguraPartidaProps) {
    return (
        <>
            {!mostrarModal ? null :
                <Modal onClose={cancelarCallback}>
                    {
                        estadoDoJogo !== EEstadoDeJogo.ATIVO && (
                            <div className="flex flex-col items-center justify-center gap-4">
                                <h2 className="text-2xl font-bold">
                                    {estadoDoJogo === EEstadoDeJogo.VITORIA
                                        ? "Parabéns! Você venceu!"
                                        : "Que pena! Você perdeu!"}
                                </h2>
                                <p className="text-lg">
                                    A palavra era:{" "}
                                    <span className="font-semibold">
                                        {resposta}
                                    </span>
                                </p>
                                <div className="flex flex-col gap-4 w-full ">

                                    <Button
                                        className="btn-accent flex-1 px-6 py-4 text-lg font-display gap-2 min-w-[200px] outline lg"
                                        label="Jogar Novamente"
                                        onClick={jogarNovamenteCallback}
                                    />
                                    <Button label="Cancelar" onClick={cancelarCallback} />
                                </div>
                            </div>
                        )
                    }
                </Modal>
            }
        </>)
}
type ModalConfiguraPartidaProps = {
    mostrarModal: boolean;
    estadoDoJogo: EEstadoDeJogo;
    resposta: string;
    jogarNovamenteCallback: () => void;
    cancelarCallback?: () => void;
}