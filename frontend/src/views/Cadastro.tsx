import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { criarUsuario } from "../api/usuario";
import { armazenamentoLocal } from "../utils/local_storage";
import { pegarErroTexto, validarEmail, validarSenha } from "../utils/validacao";
import { Button } from "../components/Button";
import { useUsuario } from "../hooks/usuario";
import { UserPlus, LogIn } from "lucide-react";
import type { EDificuldade } from "jogodaforca-shared";
import Select, { type OptionProps } from "../components/Select";

export function Cadastro() {
    const { atualizar } = useUsuario();
    const nav = useNavigate();

    const [nome, setNome] = useState("");
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [dificuldade, setDificuldade] = useState<EDificuldade | "">("");
    const [errors, setErrors] = useState({ nome: "", email: "", senha: "", dificuldade: "" });
    const [isLoading, setIsLoading] = useState(false);

    const dificuldades: OptionProps[] = [
        { valor: "fácil", texto: "Fácil" },
        { valor: "médio", texto: "Médio" },
        { valor: "difícil", texto: "Difícil" },
    ];

    async function tentarCriar(e: React.FormEvent) {
        e.preventDefault();

        // Validações
        const emailValido = validarEmail(email);
        const senhaValida = validarSenha(senha);
        const nomeValido = nome.trim().length >= 3;
        const dificuldadeValida = dificuldade !== "";

        if (!emailValido.success || !senhaValida.success || !nomeValido || !dificuldadeValida) {
            setErrors({
                email: emailValido.success ? "" : pegarErroTexto(emailValido) ?? "",
                senha: senhaValida.success ? "" : pegarErroTexto(senhaValida) ?? "",
                nome: nomeValido ? "" : "Nome deve ter no mínimo 3 caracteres",
                dificuldade: dificuldadeValida ? "" : "Selecione uma dificuldade",
            });
            limparErros();
            return;
        }

        setIsLoading(true);
        try {
            const token = await criarUsuario({
                nome: nome.trim(),
                email: emailValido.data,
                senha: senhaValida.data,
                dificuldade: dificuldade as EDificuldade,
            });

            if (token) {
                armazenamentoLocal({ chave: "token", acao: "atribuir", valor: token });
                await atualizar();
                nav("/");
            }
        } finally {
            setIsLoading(false);
        }
    }

    function limparErros() {
        setTimeout(() => {
            setErrors({ nome: "", email: "", senha: "", dificuldade: "" });
        }, 3000);
    }

    return (
        <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 py-8">
            {/* Header */}
            <div className="relative mb-8 flex flex-col items-center animate-fade-in">
                <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                    <UserPlus className="w-10 h-10 text-primary" />
                </div>
                <h1 className="font-display font-bold text-4xl sm:text-5xl text-foreground text-center mb-2">
                    Criar Conta
                </h1>
                <p className="text-muted-foreground text-center max-w-md">
                    Junte-se e comece a jogar agora mesmo
                </p>
            </div>

            {/* Form Card */}
            <div className="w-full max-w-md">
                <div className="bg-card border border-border rounded-xl p-6 sm:p-8 shadow-md">
                    <form onSubmit={tentarCriar} className="space-y-5">
                        {/* Nome */}
                        <div>
                            <label htmlFor="nome" className="block text-sm font-medium text-foreground mb-2">
                                Nome
                            </label>
                            <input
                                id="nome"
                                type="text"
                                value={nome}
                                onChange={(e) => setNome(e.target.value)}
                                className="w-full border border-border bg-background text-foreground rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                                placeholder="Seu nome"
                                disabled={isLoading}
                            />
                            {errors.nome && (
                                <p className="text-destructive text-sm mt-1.5 animate-fade-in">
                                    {errors.nome}
                                </p>
                            )}
                        </div>

                        {/* Email */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                                Email
                            </label>
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full border border-border bg-background text-foreground rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                                placeholder="seu@email.com"
                                disabled={isLoading}
                            />
                            {errors.email && (
                                <p className="text-destructive text-sm mt-1.5 animate-fade-in">
                                    {errors.email}
                                </p>
                            )}
                        </div>

                        {/* Senha */}
                        <div>
                            <label htmlFor="senha" className="block text-sm font-medium text-foreground mb-2">
                                Senha
                            </label>
                            <input
                                id="senha"
                                type="password"
                                value={senha}
                                onChange={(e) => setSenha(e.target.value)}
                                className="w-full border border-border bg-background text-foreground rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                                placeholder="Mínimo 6 caracteres"
                                disabled={isLoading}
                            />
                            {errors.senha && (
                                <p className="text-destructive text-sm mt-1.5 animate-fade-in">
                                    {errors.senha}
                                </p>
                            )}
                        </div>

                        {/* Dificuldade */}
                        <div>
                            <Select
                                label="Dificuldade Padrão"
                                valorSelecionado={dificuldade}
                                aoAlterar={(valor) => setDificuldade(valor as EDificuldade)}
                                opcoes={dificuldades}
                            />
                            {errors.dificuldade && (
                                <p className="text-destructive text-sm mt-1.5 animate-fade-in">
                                    {errors.dificuldade}
                                </p>
                            )}
                        </div>

                        {/* Submit Button */}
                        <Button
                            label="Criar Conta"
                            className="btn-primary w-full py-3 text-base font-display gap-2 outline"
                            image={<UserPlus className="w-5 h-5" />}
                            carregando={isLoading}
                        />
                    </form>

                    {/* Divider */}
                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-border"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-4 bg-card text-muted-foreground">ou</span>
                        </div>
                    </div>

                    {/* Login */}
                    <Link to="/login">
                        <Button
                            label="Já tenho conta"
                            className="w-full py-3 text-base font-display gap-2 outline hover:bg-secondary"
                            image={<LogIn className="w-5 h-5" />}
                        />
                    </Link>
                </div>

                {/* Jogar como convidado */}
                <div className="text-center mt-6">
                    <Link to="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                        Continuar como convidado
                    </Link>
                </div>
            </div>
        </div>
    );
}
