export function Button({ label, carregando, onClick, className, size, variant, image, disabled }: ButtonProps) {
    return (
        <button
            className={"".concat(className ?? "", " ", size ?? "", " ", variant ?? "")}
            onClick={onClick}
            disabled={carregando || disabled}
        >
            {carregando ? (
                <>
                    <svg className="animate-spin h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Carregando...</span>
                </>
            ) : (
                <div className="flex items-center align-middle content-center justify-center gap-2">
                    {image}
                    < span > {label}</span>
                </div>
            )
            }
        </button >
    );
}

type ButtonProps = {
    label: string | React.ReactNode;
    onClick?: () => void;
    carregando?: boolean;
    variant?: string;
    size?: string;
    className?: string;
    image?: React.ReactNode;
    disabled?: boolean;
}