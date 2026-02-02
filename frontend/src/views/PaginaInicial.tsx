import { Gamepad2, Sparkles, Trophy } from "lucide-react";
import { Button } from "../components/Button";
import { Link, useOutletContext } from "react-router-dom";
import type { LayoutOutletContext } from "./Layout";
import { useState } from "react";
import { ConfiguraPartida } from "../components/ConfiguraPartida";
import { Modal } from "../components/Modal";

export function PaginaInicial() {
    const { iniciarPartida, partidaViaIA } = useOutletContext<LayoutOutletContext>();
    const [show, setShow] = useState(false);

    function fecharModal() {
        setShow(false);
    }

    return (
        <div className="min-h-screen flex flex-col">
            {show ? <Modal onClose={fecharModal} >
                <ConfiguraPartida iniciarPartidaCallback={iniciarPartida} cancelarCallback={fecharModal} partidaViaIACallback={partidaViaIA} />
            </Modal> : null
            }
            <div className="flex-1 flex flex-col items-center justify-center px-4 py-12">
                <div className="relative mb-8">
                    <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-2xl bg-primary/10 flex items-center justify-center animate-bounce-subtle">
                        <Gamepad2 className="w-12 h-12 sm:w-16 sm:h-16 text-primary" />
                    </div>
                    <Sparkles className="absolute -top-2 -right-2 w-6 h-6 text-accent animate-pulse" />
                </div>

                <h1 className="font-display font-bold text-4xl sm:text-5xl lg:text-6xl text-foreground text-center mb-4 text-shadow-sm">
                    Jogo da Forca
                </h1>

                <p className="text-muted-foreground text-lg sm:text-xl text-center max-w-md mb-12">
                    Descubra a palavra antes que seja tarde demais!
                </p>

                <div className="flex flex-col sm:flex-row items-center gap-4">
                    <Button
                        size="lg"
                        onClick={() => setShow(true)}
                        className="btn-accent px-8 py-6 text-lg font-display gap-2 min-w-[200px] outline lg"
                        label="Novo Jogo"
                        image={<Gamepad2 className="w-5 h-5" />}
                    />
                    <Link to="/ranking">
                        <Button
                            onClick={() => { }}
                            className="px-8 py-6 text-lg font-display gap-2 min-w-[200px] hover:bg-secondary outline lg"
                            label="Ranking"
                            image={<Trophy className="w-5 h-5" />}
                        />
                    </Link>
                </div>
            </div>

            {/* Footer */}
            <footer className="py-6 text-center">
                <p className="text-xs text-muted-foreground/60">
                    Feito com ❤️ para aprender jogando
                </p>
            </footer>
        </div >
    )
}