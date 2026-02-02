import { Lightbulb, Loader2 } from "lucide-react";
import { Button } from "./Button";

interface DicaProps {
    dicas: string[];
    pegarDicaCallback: () => void;
    isLoading?: boolean;
}

export function Dica({ dicas, pegarDicaCallback, isLoading = false }: DicaProps) {
    return (
        <div className="bg-card rounded-lg shadow-md p-4 border border-border">
            <div className="flex items-center gap-2 mb-3">
                <Lightbulb className="w-5 h-5 text-warning" />
                <h3 className="font-display font-semibold text-lg text-foreground">Dicas</h3>
            </div>
            {dicas.length > 0 ? (
                <ul className="space-y-2">
                    {dicas.map((dica, index) => (
                        <li
                            key={index}
                            className="flex items-start gap-2 text-muted-foreground text-sm"
                        >
                            <span className="flex-shrink-0 w-5 h-5 rounded-full bg-warning/10 text-warning flex items-center justify-center text-xs font-semibold mt-0.5">
                                {index + 1}
                            </span>
                            <span>{dica}</span>
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="text-muted-foreground text-sm italic">
                    Nenhuma dica disponível ainda
                </p>
            )}
            <div className="flex justify-end">
                <Button 
                    className="btn-accent flex-1 text-lg gap-2 outline" 
                    label={
                        isLoading ? (
                            <span className="flex items-center gap-2">
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Carregando...
                            </span>
                        ) : (
                            dicas.length === 3 ? "pedir dica a IA" : "pedir dica"
                        )
                    } 
                    onClick={pegarDicaCallback}
                    disabled={isLoading}
                />

            </div>

        </div>
    );
}
