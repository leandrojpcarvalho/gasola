import { Loader2 } from "lucide-react";

export function Carregando() {
    return (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background/95 backdrop-blur-sm">
            <Loader2 className="w-16 h-16 text-primary animate-spin mb-6" />
            <div className="flex items-center gap-1 text-2xl font-display font-semibold text-foreground">
                <span>Carregando</span>
                <span className="flex gap-0.5">
                    <span className="animate-dots-1">.</span>
                    <span className="animate-dots-2">.</span>
                    <span className="animate-dots-3">.</span>
                </span>
            </div>
        </div>
    );
}
