interface PalavraProps {
    letras: (string | null)[];
    gameOver?: boolean;
}

export function Palavra({ letras, gameOver = false }: PalavraProps) {
    return (
        <div className="flex justify-center gap-2 sm:gap-3 flex-wrap">
            {letras.map((letra, index) => {
                const isRevealed = letra !== null && letra !== '_';
                const isEmpty = letra === null || letra === '_';

                return (
                    <div
                        key={index}
                        className={`
              letter-slot flex items-end justify-center pb-1
              ${isRevealed ? "letter-slot-revealed" : ""}
              ${gameOver && isEmpty ? "text-destructive border-destructive" : ""}
            `}
                    >
                        <span
                            className={`
                transition-all duration-300
                ${isRevealed ? "opacity-100 transform-none" : "opacity-0 -translate-y-2"}
              `}
                        >
                            {isRevealed ? letra.toUpperCase() : ""}
                        </span>
                    </div>
                );
            })}
        </div>
    );
}