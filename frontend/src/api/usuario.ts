import type {
  Historico,
  LoginUsuario,
  NovoUsuario,
  Usuario,
} from "jogodaforca-shared";
import { usuarioApiRequest } from "./config";

export async function login(info: LoginUsuario): Promise<string | null> {
  return usuarioApiRequest({
    metodo: "post",
    rota: "login",
    payload: info,
  });
}

export async function criarUsuario(info: NovoUsuario): Promise<string | null> {
  return usuarioApiRequest({
    metodo: "post",
    rota: "criar",
    payload: info,
  });
}

export async function contaGuest(): Promise<string | null> {
  return usuarioApiRequest(
    {
      metodo: "post",
      rota: "criarGuest",
      payload: {},
    },
    false,
  );
}

export async function obterInfoUsuario(): Promise<Usuario | null> {
  return usuarioApiRequest(
    {
      metodo: "get",
      rota: "obterInfo",
    },
    false,
  );
}

export async function atualizarInfoUsuario(
  info: Partial<Usuario>,
): Promise<Usuario | null> {
  console.log("Atualizando info do usuário:", info);
  return usuarioApiRequest({
    metodo: "put",
    rota: "atualizarUsuario",
    payload: info,
  });
}

export async function obterHistoricoUsuario(): Promise<Historico[] | null> {
  return usuarioApiRequest(
    {
      metodo: "get",
      rota: "obterHistorico",
    },
    false,
  );
}
