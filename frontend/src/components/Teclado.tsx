import type React from "react";

interface KeyboardProps {
    pressionarTecla: (event: React.MouseEvent<HTMLButtonElement>) => void;
    letrasErradas: Set<string>;
    letrasCorretas: Set<string>;
    desabilitado?: boolean;
}

const KEYBOARD_ROWS = [
    ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
    ["A", "S", "D", "F", "G", "H", "J", "K", "L", "Ç"],
    ["Z", "X", "C", "V", "B", "N", "M"],
];

export function Teclado({ pressionarTecla, letrasErradas, letrasCorretas, desabilitado = false }: KeyboardProps) {
    const getKeyClass = (letter: string) => {
        const lowerLetter = letter.toLowerCase();

        if (letrasCorretas.has(lowerLetter)) {
            return "keyboard-key-correct";
        }

        if (letrasErradas.has(lowerLetter)) {
            return "keyboard-key-wrong";
        }

        return "keyboard-key-default";
    };

    const isKeyDisabled = (letter: string) => {
        const lowerLetter = letter.toLowerCase();
        return desabilitado || letrasErradas.has(lowerLetter) || letrasCorretas.has(lowerLetter);
    };

    return (
        <div className="flex flex-col items-center gap-1.5 sm:gap-2">
            {KEYBOARD_ROWS.map((row, rowIndex) => (
                <div key={rowIndex} className="flex gap-1 sm:gap-1.5">
                    {row.map((letter) => (
                        <button
                            key={letter}
                            onClick={pressionarTecla}
                            disabled={isKeyDisabled(letter)}
                            className={`
                keyboard-key
                w-8 h-10 sm:w-10 sm:h-12 text-sm sm:text-base
                ${getKeyClass(letter)}
                ${isKeyDisabled(letter) ? "cursor-not-allowed" : "cursor-pointer"}
              `}
                        >
                            {letter}
                        </button>
                    ))}
                </div>
            ))}
        </div>
    );
}
