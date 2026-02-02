import { Trophy } from "lucide-react";

interface ScoreProps {
    pontuacao: number;
    pontuacaoMaxima?: number;
}

export function Score({ pontuacao, pontuacaoMaxima }: ScoreProps) {
    const porcentagem = pontuacaoMaxima
        ? Math.round((pontuacao / pontuacaoMaxima) * 100)
        : 0;

    return (
        <div className="bg-card rounded-lg shadow-md p-4 border border-border">
            <div className="flex items-center gap-2 mb-3">
                <Trophy className="w-5 h-5 text-accent" />
                <h3 className="font-display font-semibold text-lg text-foreground">Pontuação</h3>
            </div>
            <div className="space-y-3">
                <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-bold text-accent font-display">
                        {pontuacao}
                    </span>
                    {pontuacaoMaxima && (
                        <span className="text-lg text-muted-foreground">
                            / {pontuacaoMaxima}
                        </span>
                    )}
                </div>
                {pontuacaoMaxima && (
                    <div className="w-full bg-secondary rounded-full h-2 overflow-hidden">
                        <div
                            className="bg-accent h-full transition-all duration-500 ease-out"
                            style={{ width: `${porcentagem}%` }}
                        />
                    </div>
                )}
                {pontuacaoMaxima && (
                    <p className="text-xs text-muted-foreground">
                        {porcentagem}% da pontuação máxima
                    </p>
                )}
            </div>
        </div>
    );
}
