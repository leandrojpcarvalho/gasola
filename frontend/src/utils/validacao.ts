import zod from "zod";

const emailSchema = zod.email();
const senhaSchema = zod.string().min(6).max(100);

type ComposeString = string | null | undefined;

export function validarEmail(email: ComposeString) {
  return emailSchema.safeParse(email);
}

export function validarSenha(senha: ComposeString) {
  return senhaSchema.safeParse(senha);
}

export function validarLogin(email: ComposeString, senha: ComposeString) {
  const emailValido = validarEmail(email);
  const senhaValida = validarSenha(senha);

  return {
    email: emailValido,
    senha: senhaValida,
  };
}

export function pegarErroTexto(valor: zod.ZodSafeParseResult<string>) {
  if (valor.success) {
    return null;
  }
  return valor.error._zod.def
    .map((err) => {
      if (err.message.toLowerCase().includes("too small")) {
        return "A senha deve ter entre 6 e 100 caracteres.";
      }
      if (err.message.toLowerCase().includes("too big")) {
        return "A senha deve ter entre 6 e 100 caracteres.";
      }
      if (err.message.toLowerCase().includes("email")) {
        return "O email fornecido não é válido.";
      }
      return err.message;
    })
    .join(", ");
}
