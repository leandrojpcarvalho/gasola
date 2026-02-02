import type { ReactNode } from "react";

type ModalProps = {
    children: ReactNode;
    onClose?: () => void;
    className?: string;
};

export function Modal({ children, onClose, className = "" }: ModalProps) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
            <div className={`relative w-full max-w-lg rounded-lg bg-white p-6 shadow-lg ${className}`}>
                {onClose && (
                    <button
                        type="button"
                        onClick={onClose}
                        className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
                        aria-label="Fechar modal"
                    >
                        ×
                    </button>
                )}
                {children}
            </div>
        </div>
    );
}