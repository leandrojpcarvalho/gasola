import { User, Save, Trophy, Calendar, Target, Award } from "lucide-react";
import { Button } from "../components/Button";
import { useEffect, useState } from "react";
import { obterInfoUsuario, atualizarInfoUsuario, obterHistoricoUsuario } from "../api/usuario";
import type { Historico, CriacaoUsuario } from "jogodaforca-shared";
import { EDificuldade, EEstadoDeJogo } from "jogodaforca-shared";
import Select, { type OptionProps } from "../components/Select";
import { alert } from "../utils/alert";

export function Usuario() {
    const [historico, setHistorico] = useState<Historico[]>([]);
    const [loading, setLoading] = useState(true);
    const [salvando, setSalvando] = useState(false);

    // Form state
    const [nome, setNome] = useState("");
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [dificuldade, setDificuldade] = useState<EDificuldade>(EDificuldade.MEDIO);

    const dificuldades: OptionProps[] = Object.values(EDificuldade).map((dif) => ({
        valor: dif,
        texto: dif.charAt(0).toUpperCase() + dif.slice(1)
    }));

    useEffect(() => {
        async function carregarDados() {
            try {
                const [dadosUsuario, dadosHistorico] = await Promise.all([
                    obterInfoUsuario(),
                    obterHistoricoUsuario()
                ]);

                if (dadosUsuario) {
                    setNome(dadosUsuario.nome);
                    setEmail(dadosUsuario.email);
                    setDificuldade(dadosUsuario.dificuldade);
                }

                if (dadosHistorico) {
                    setHistorico(dadosHistorico);
                }
            } catch (error) {
                console.error("Erro ao carregar dados:", error);
                alert(500, "Erro", "Não foi possível carregar os dados do usuário");
            } finally {
                setLoading(false);
            }
        }
        carregarDados();
    }, []);

    async function handleSalvar() {
        if (!nome.trim()) {
            alert(400, "Erro", "Nome não pode estar vazio");
            return;
        }

        setSalvando(true);
        try {
            const dadosAtualizacao: Partial<CriacaoUsuario> = {
                nome,
                dificuldade,
            };

            if (senha.trim()) {
                dadosAtualizacao.senha = senha;
            }

            const resultado = await atualizarInfoUsuario(dadosAtualizacao);

            if (resultado) {
                setSenha("");
                alert(200, "Sucesso", "Informações atualizadas com sucesso!");
            }
        } catch (error) {
            console.error("Erro ao atualizar:", error);
            alert(500, "Erro", "Não foi possível atualizar as informações");
        } finally {
            setSalvando(false);
        }
    }

    const getResultadoIcon = (resultado: EEstadoDeJogo) => {
        if (resultado === EEstadoDeJogo.VITORIA) {
            return <Trophy className="w-5 h-5 text-success" />;
        }
        return <Target className="w-5 h-5 text-destructive" />;
    };

    const getResultadoClass = (resultado: EEstadoDeJogo) => {
        if (resultado === EEstadoDeJogo.VITORIA) {
            return "bg-success/10 border-success/30";
        }
        return "bg-destructive/10 border-destructive/30";
    };

    const calcularEstatisticas = () => {
        const total = historico.length;
        const vitorias = historico.filter(h => h.resultado === EEstadoDeJogo.VITORIA).length;
        const pontuacaoTotal = historico.reduce((acc, h) => acc + h.pontuacao, 0);
        const taxaVitoria = total > 0 ? Math.round((vitorias / total) * 100) : 0;

        return { total, vitorias, pontuacaoTotal, taxaVitoria };
    };

    const stats = calcularEstatisticas();

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-muted-foreground">Carregando...</div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                    <User className="w-8 h-8 text-primary" />
                </div>
                <div>
                    <h1 className="font-display font-bold text-3xl text-foreground">
                        Meu Perfil
                    </h1>
                    <p className="text-muted-foreground">
                        Gerencie suas informações e veja seu histórico
                    </p>
                </div>
            </div>

            {/* Estatísticas */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
                <div className="bg-card border border-border rounded-xl p-4">
                    <div className="flex items-center gap-2 text-muted-foreground mb-1">
                        <Trophy className="w-4 h-4" />
                        <span className="text-sm">Vitórias</span>
                    </div>
                    <p className="text-2xl font-bold text-foreground">{stats.vitorias}</p>
                </div>
                <div className="bg-card border border-border rounded-xl p-4">
                    <div className="flex items-center gap-2 text-muted-foreground mb-1">
                        <Target className="w-4 h-4" />
                        <span className="text-sm">Taxa</span>
                    </div>
                    <p className="text-2xl font-bold text-foreground">{stats.taxaVitoria}%</p>
                </div>
                <div className="bg-card border border-border rounded-xl p-4">
                    <div className="flex items-center gap-2 text-muted-foreground mb-1">
                        <Award className="w-4 h-4" />
                        <span className="text-sm">Pontos</span>
                    </div>
                    <p className="text-2xl font-bold text-foreground">{stats.pontuacaoTotal}</p>
                </div>
                <div className="bg-card border border-border rounded-xl p-4">
                    <div className="flex items-center gap-2 text-muted-foreground mb-1">
                        <Calendar className="w-4 h-4" />
                        <span className="text-sm">Jogos</span>
                    </div>
                    <p className="text-2xl font-bold text-foreground">{stats.total}</p>
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                {/* Formulário de Informações */}
                <div className="bg-card border border-border rounded-xl p-6">
                    <h2 className="font-display font-semibold text-xl text-foreground mb-4">
                        Informações Pessoais
                    </h2>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-2">
                                Nome
                            </label>
                            <input
                                type="text"
                                value={nome}
                                onChange={(e) => setNome(e.target.value)}
                                className="w-full border border-border bg-background text-foreground rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                placeholder="Seu nome"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-foreground mb-2">
                                Email
                            </label>
                            <input
                                type="email"
                                value={email}
                                disabled
                                className="w-full border border-border bg-muted text-muted-foreground rounded-md px-3 py-2 cursor-not-allowed"
                            />
                            <p className="text-xs text-muted-foreground mt-1">
                                O email não pode ser alterado
                            </p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-foreground mb-2">
                                Nova Senha (opcional)
                            </label>
                            <input
                                type="password"
                                value={senha}
                                onChange={(e) => setSenha(e.target.value)}
                                className="w-full border border-border bg-background text-foreground rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                placeholder="Deixe em branco para manter a atual"
                            />
                        </div>

                        <Select
                            label="Dificuldade Padrão"
                            valorSelecionado={dificuldade}
                            aoAlterar={(valor) => setDificuldade(valor as EDificuldade)}
                            opcoes={dificuldades}
                        />

                        <Button
                            className="btn-primary w-full py-3 gap-2 outline"
                            label="Salvar Alterações"
                            image={<Save className="w-5 h-5" />}
                            onClick={handleSalvar}
                            carregando={salvando}
                        />
                    </div>
                </div>

                {/* Histórico de Jogos */}
                <div className="bg-card border border-border rounded-xl p-6">
                    <h2 className="font-display font-semibold text-xl text-foreground mb-4">
                        Histórico Recente
                    </h2>

                    <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
                        {historico.length === 0 ? (
                            <div className="text-center py-8 text-muted-foreground">
                                <Trophy className="w-12 h-12 mx-auto mb-3 opacity-30" />
                                <p>Nenhum jogo jogado ainda</p>
                            </div>
                        ) : (
                            historico.slice(0, 10).map((jogo) => (
                                <div
                                    key={jogo.idJogo}
                                    className={`
                                        flex items-center gap-3 p-3 rounded-lg border-2
                                        ${getResultadoClass(jogo.resultado)}
                                        transition-all duration-200 hover:scale-[1.02]
                                    `}
                                >
                                    <div className="flex-shrink-0">
                                        {getResultadoIcon(jogo.resultado)}
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <p className="font-semibold text-foreground truncate">
                                            {jogo.palavra}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            {jogo.dificuldade} • {new Date(jogo.criadoEm).toLocaleDateString()}
                                        </p>
                                    </div>

                                    <div className="text-right flex-shrink-0">
                                        <p className="text-lg font-bold text-primary">
                                            {jogo.pontuacao}
                                        </p>
                                        <p className="text-xs text-muted-foreground">pts</p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}