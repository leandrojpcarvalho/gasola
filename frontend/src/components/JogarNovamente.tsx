import { EEstadoDeJogo } from "jogodaforca-shared";
import { Button } from "./Button";
import { Trophy, X, PartyPopper } from "lucide-react";
import { useEffect } from "react";

export function JogarNovamente({ estadoDoJogo, resposta, jogarNovamenteCallback, cancelarCallback = () => { } }: ModalConfiguraPartidaProps) {
    const vitoria = estadoDoJogo === EEstadoDeJogo.VITORIA;

    useEffect(() => {
        if (estadoDoJogo === EEstadoDeJogo.ATIVO) return;

        // Efeito de confete para vitória
        if (vitoria) {
            const duration = 3000;
            const end = Date.now() + duration;
            const colors = ['#FFD700', '#FFA500', '#FF6347', '#00CED1', '#9370DB'];

            const frame = () => {
                const timeLeft = end - Date.now();
                if (timeLeft <= 0) return;

                const particleCount = 2;
                for (let i = 0; i < particleCount; i++) {
                    const particle = document.createElement('div');
                    particle.className = 'confetti-particle';
                    particle.style.cssText = `
                        position: fixed;
                        width: ${Math.random() * 10 + 5}px;
                        height: ${Math.random() * 10 + 5}px;
                        background: ${colors[Math.floor(Math.random() * colors.length)]};
                        left: ${Math.random() * 100}%;
                        top: -20px;
                        opacity: 1;
                        border-radius: ${Math.random() > 0.5 ? '50%' : '0'};
                        animation: confetti-fall ${Math.random() * 2 + 2}s linear forwards;
                        z-index: 9999;
                        pointer-events: none;
                    `;
                    document.body.appendChild(particle);
                    setTimeout(() => particle.remove(), 4000);
                }

                requestAnimationFrame(frame);
            };

            // Adicionar keyframes de animação se não existir
            if (!document.getElementById('confetti-styles')) {
                const style = document.createElement('style');
                style.id = 'confetti-styles';
                style.textContent = `
                    @keyframes confetti-fall {
                        to {
                            transform: translateY(100vh) rotate(${Math.random() * 360}deg);
                            opacity: 0;
                        }
                    }
                `;
                document.head.appendChild(style);
            }

            requestAnimationFrame(frame);
        }
    }, [estadoDoJogo, vitoria]);

    return (
        <>
            <div className="flex flex-col items-center justify-center gap-6 p-4">
                {/* Ícone de resultado */}
                <div className={`w-24 h-24 rounded-full flex items-center justify-center ${vitoria
                    ? 'bg-warning/20 animate-bounce'
                    : 'bg-destructive/20'
                    }`}>
                    {vitoria ? (
                        <Trophy className="w-12 h-12 text-warning" />
                    ) : (
                        <X className="w-12 h-12 text-destructive" />
                    )}
                </div>

                {/* Título com animação */}
                <h2 className={`text-3xl font-bold text-center animate-fade-in ${vitoria ? 'text-warning' : 'text-foreground'
                    }`}>
                    {vitoria
                        ? "🎉 Parabéns! Você venceu! 🎉"
                        : "😔 Que pena! Você perdeu!"}
                </h2>

                {/* Palavra revelada */}
                <div className="bg-secondary/50 rounded-lg p-4 w-full">
                    <p className="text-center text-lg">
                        A palavra era:
                    </p>
                    <p className="text-center text-2xl font-bold text-primary mt-2 uppercase tracking-wider">
                        {resposta}
                    </p>
                </div>

                {/* Botões */}
                <div className="flex flex-col gap-3 w-full mt-2">
                    <Button
                        className="btn-accent flex-1 px-6 py-4 text-lg font-display gap-2 min-w-[200px] outline lg"
                        label="Jogar Novamente"
                        onClick={jogarNovamenteCallback}
                        image={<PartyPopper className="w-5 h-5" />}
                    />
                    <Button
                        label="Voltar ao Início"
                        onClick={cancelarCallback}
                        className="btn-ghost"
                    />
                </div>
            </div>
        </>)
}
type ModalConfiguraPartidaProps = {
    estadoDoJogo: EEstadoDeJogo;
    resposta: string;
    jogarNovamenteCallback: () => void;
    cancelarCallback?: () => void;
}