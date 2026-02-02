import { useRef, useState } from "react";
import { login } from "../api/usuario";
import { armazenamentoLocal } from "../utils/local_storage";
import { pegarErroTexto, validarLogin } from "../utils/validacao";
import { Button } from "../components/Button";
import { useUsuario } from "../hooks/usuario";

export function Login() {
    const { atualizar } = useUsuario();

    const [fields, setFields] = useState({ email: "", senha: "" });

    const email = useRef<HTMLInputElement>(null);
    const senha = useRef<HTMLInputElement>(null);

    async function tentarLogin() {
        const eValido = validarLogin(email.current?.value, senha.current?.value);
        if (!eValido.email.success || !eValido.senha.success) {
            if (eValido.email.error) {
                const email = pegarErroTexto(eValido.email) ?? "";
                setFields((prev => ({ ...prev, email })));
            }
            if (eValido.senha.error) {
                const senha = pegarErroTexto(eValido.senha) ?? "";
                setFields((prev => ({ ...prev, senha })));
            }
            limparErros();
            return;
        }

        const token = await login({
            email: eValido.email.data,
            senha: eValido.senha.data,
        })

        if (token) {
            armazenamentoLocal({ chave: "token", acao: "atribuir", valor: token });
            await atualizar();
        }
    }

    function limparErros() {
        setTimeout(() => {
            setFields({ email: "", senha: "" });
        }, 3000);
    }

    return (
        <div className="container flex-auto mx-auto justify-center px-4 py-8">
            <h2>Login</h2>
            <form className="flex flex-col gap-4 max-w-sm gap-2">
                <div className="align-items-center mb-3">
                    <input type="email" placeholder="Email" ref={email} />
                    {fields.email !== "" && <span className="text-danger ms-2">{fields.email}</span>}
                </div>
                <div>
                    <input type="password" placeholder="Senha" ref={senha} />
                    {fields.senha !== "" && <span className="text-danger ms-2">{fields.senha}</span>}
                </div>
                <Button label="Entrar" onClick={tentarLogin} />
            </form>
        </div>
    );
}
