import { Heart } from "lucide-react";
import { useEffect, useState } from "react";

interface VidaProps {
    vidas: number;
    vidasMax?: number;
}

export function Vida({ vidas, vidasMax = 6 }: VidaProps) {
    const [removendoIndex, setRemovendoIndex] = useState<number | null>(null);
    const [vidasAtual, setVidasAtual] = useState(vidas);

    useEffect(() => {
        if (vidas < vidasAtual) {
            // Vida foi perdida
            const indexRemovido = vidas;
            setRemovendoIndex(indexRemovido);

            // Aguarda animação terminar antes de atualizar
            setTimeout(() => {
                setVidasAtual(vidas);
                setRemovendoIndex(null);
            }, 800);
        } else {
            setVidasAtual(vidas);
        }
    }, [vidas, vidasAtual]);

    return (
        <div className="flex gap-2 justify-center items-center">
            {Array.from({ length: vidasMax }).map((_, index) => {
                const temVida = index < vidasAtual;
                const estaRemovendo = index === removendoIndex;

                return (
                    <div
                        key={index}
                        className={`
                            transition-all duration-300
                            ${estaRemovendo ? 'animate-heart-break' : ''}
                            ${!temVida && !estaRemovendo ? 'opacity-30 scale-75' : ''}
                        `}
                    >
                        <Heart
                            className={`
                                w-8 h-8 transition-all duration-200
                                ${temVida || estaRemovendo ? 'fill-red-500 text-red-500' : 'text-gray-400'}
                            `}
                        />
                    </div>
                );
            })}
        </div>
    );
}
