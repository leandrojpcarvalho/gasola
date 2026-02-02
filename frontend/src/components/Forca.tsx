interface HangmanFigureProps {
    tentativas: number;
    tentativasMax?: number;
}

export function Forca({ tentativas, tentativasMax = 6 }: HangmanFigureProps) {
    const parts = [
        // Head
        <circle
            key="head"
            cx="150"
            cy="70"
            r="20"
            className="fill-none stroke-[hsl(var(--hangman-stroke))]"
            strokeWidth="4"
        />,
        // Body
        <line
            key="body"
            x1="150"
            y1="90"
            x2="150"
            y2="150"
            className="stroke-[hsl(var(--hangman-stroke))]"
            strokeWidth="4"
            strokeLinecap="round"
        />,
        // Left arm
        <line
            key="left-arm"
            x1="150"
            y1="110"
            x2="120"
            y2="140"
            className="stroke-[hsl(var(--hangman-stroke))]"
            strokeWidth="4"
            strokeLinecap="round"
        />,
        // Right arm
        <line
            key="right-arm"
            x1="150"
            y1="110"
            x2="180"
            y2="140"
            className="stroke-[hsl(var(--hangman-stroke))]"
            strokeWidth="4"
            strokeLinecap="round"
        />,
        // Left leg
        <line
            key="left-leg"
            x1="150"
            y1="150"
            x2="120"
            y2="190"
            className="stroke-[hsl(var(--hangman-stroke))]"
            strokeWidth="4"
            strokeLinecap="round"
        />,
        // Right leg
        <line
            key="right-leg"
            x1="150"
            y1="150"
            x2="180"
            y2="190"
            className="stroke-[hsl(var(--hangman-stroke))]"
            strokeWidth="4"
            strokeLinecap="round"
        />,
    ];

    return (
        <div className="flex justify-center">
            <svg
                viewBox="0 0 220 220"
                className="w-40 h-40 sm:w-80 sm:h-80"
            >
                {/* Gallows */}
                <g className="stroke-[hsl(var(--hangman-stroke))]" strokeWidth="4" strokeLinecap="round">
                    {/* Base */}
                    <line x1="40" y1="210" x2="120" y2="210" />
                    {/* Vertical pole */}
                    <line x1="80" y1="210" x2="80" y2="20" />
                    {/* Horizontal beam */}
                    <line x1="80" y1="20" x2="150" y2="20" />
                    {/* Rope */}
                    <line x1="150" y1="20" x2="150" y2="50" />
                </g>

                {/* Body parts based on wrong attempts */}
                {parts.slice(0, tentativas)}

                {/* Sad face when game over */}
                {tentativas >= tentativasMax && (
                    <g className="stroke-[hsl(var(--hangman-stroke))]" strokeWidth="2">
                        {/* Left eye X */}
                        <line x1="140" y1="63" x2="146" y2="69" />
                        <line x1="146" y1="63" x2="140" y2="69" />
                        {/* Right eye X */}
                        <line x1="154" y1="63" x2="160" y2="69" />
                        <line x1="160" y1="63" x2="154" y2="69" />
                        {/* Sad mouth */}
                        <path d="M 140 80 Q 150 74 160 80" fill="none" />
                    </g>
                )}
            </svg>
        </div>
    );
}