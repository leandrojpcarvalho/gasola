import { Trophy, Medal, Crown, ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "../components/Button";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import type { Ranking as RankingType } from "jogodaforca-shared";
import { obterRanking } from "../api/jogo";

export function Ranking() {
    const [ranking, setRanking] = useState<RankingType[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function carregarRanking() {
            try {
                const dados = await obterRanking();
                if (dados) {
                    setRanking(dados);
                }
            } catch (error) {
                console.error("Erro ao carregar ranking:", error);
            } finally {
                setLoading(false);
            }
        }
        carregarRanking();
    }, []);

    const getPosicaoIcon = (posicao: number) => {
        switch (posicao) {
            case 1:
                return <Crown className="w-8 h-8 text-warning animate-pulse" />;
            case 2:
                return <Medal className="w-7 h-7 text-muted-foreground/70" />;
            case 3:
                return <Medal className="w-6 h-6 text-accent/70" />;
            default:
                return (
                    <span className="text-2xl font-bold text-muted-foreground/50">
                        {posicao}
                    </span>
                );
        }
    };

    const getPosicaoClass = (posicao: number) => {
        switch (posicao) {
            case 1:
                return "bg-gradient-to-r from-warning/20 to-warning/5 border-warning/30 shadow-lg scale-105";
            case 2:
                return "bg-gradient-to-r from-muted/30 to-muted/10 border-muted/40";
            case 3:
                return "bg-gradient-to-r from-accent/20 to-accent/5 border-accent/30";
            default:
                return "bg-card border-border hover:border-primary/30";
        }
    };

    return (
        <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 py-8">
            {/* Header */}
            <div className="relative mb-8 flex flex-col items-center animate-fade-in">
                <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                    <Trophy className="w-10 h-10 text-primary" />
                </div>
                <h1 className="font-display font-bold text-4xl sm:text-5xl text-foreground text-center mb-2">
                    Ranking
                </h1>
                <p className="text-muted-foreground text-center max-w-md">
                    Top 10 maiores pontuadores do jogo
                </p>
            </div>

            {/* Loading State */}
            {loading ? (
                <div className="flex items-center gap-2 text-muted-foreground">
                    <Loader2 className="w-6 h-6 animate-spin" />
                    <span>Carregando ranking...</span>
                </div>
            ) : (
                <>
                    {/* Ranking List */}
                    <div className="w-full max-w-2xl space-y-3 mb-8">
                        {ranking.length === 0 ? (
                            <div className="text-center py-12 text-muted-foreground">
                                <Trophy className="w-16 h-16 mx-auto mb-4 opacity-30" />
                                <p className="text-lg">Nenhum jogador no ranking ainda</p>
                                <p className="text-sm">Seja o primeiro a conquistar uma vitória!</p>
                            </div>
                        ) : (
                            ranking.map((item) => (
                                <div
                                    key={item.posicao}
                                    className={`
                                        flex items-center gap-4 p-4 rounded-xl border-2 
                                        transition-all duration-300 hover:scale-[1.02]
                                        ${getPosicaoClass(item.posicao)}
                                        animate-slide-in
                                    `}
                                    style={{ animationDelay: `${item.posicao * 50}ms` }}
                                >
                                    {/* Posição */}
                                    <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center">
                                        {getPosicaoIcon(item.posicao)}
                                    </div>

                                    {/* Nome */}
                                    <div className="flex-1 min-w-0">
                                        <p className="font-display font-semibold text-lg text-foreground truncate">
                                            {item.nome}
                                        </p>
                                    </div>

                                    {/* Pontuação */}
                                    <div className="flex-shrink-0 text-right">
                                        <div className="flex items-center gap-2">
                                            <span className="text-2xl font-bold text-primary">
                                                {item.pontuacaoTotal}
                                            </span>
                                            <span className="text-sm text-muted-foreground">pts</span>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Botão Voltar */}
                    <Link to="/">
                        <Button
                            className="btn-primary px-6 py-4 text-base font-display gap-2 outline"
                            label="Voltar ao Início"
                            image={<ArrowLeft className="w-5 h-5" />}
                        />
                    </Link>
                </>
            )}
        </div>
    );
}
