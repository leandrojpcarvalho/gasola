import axios, { AxiosError, type AxiosResponse } from "axios";
import { armazenamentoLocal } from "../utils/local_storage";
import type { RespostaApi, TiposDeRequest } from "./types";
import { alert } from "../utils/alert";
import { obterUUID } from "../utils/gerarUUID";

const apiPort = import.meta.env.VITE_API_PORT || "3333";
const apiUrl = import.meta.env.VITE_API_URL || "http://localhost";

export const baseURL = `${apiUrl}:${apiPort}`;

const apiRotas = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

const rotasUsuario = {
  criar: "/usuario/criar",
  login: "/usuario/login",
  criarGuest: "/usuario/guest",
  obterInfo: "/usuario/info",
  atualizarUsuario: "/usuario/info",
  obterHistorico: "/usuario/historico",
};

const rotasTema = {
  listar: "/tema/listar",
};

const rotasJogo = {
  ranking: "/jogo/ranking",
};

const headersComAutenticacao = () => {
  const token = armazenamentoLocal({ chave: "token", acao: "obter" });
  if (token) {
    apiRotas.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    apiRotas.defaults.headers.common["x-uuid"] = obterUUID();
  }
};

export async function usuarioApiRequest<Payload, Resposta = Payload>(
  request: TiposDeRequest<Payload, typeof rotasUsuario>,
  notificar = true,
) {
  try {
    headersComAutenticacao();
    let resposta: AxiosResponse<RespostaApi<Resposta>>;
    if (request.metodo === "post" || request.metodo === "put") {
      resposta = await apiRotas[request.metodo]<RespostaApi<Resposta>>(
        rotasUsuario[request.rota],
        request.payload,
      );
    } else {
      resposta = await apiRotas.get<RespostaApi<Resposta>>(
        rotasUsuario[request.rota],
      );
    }
    const { status, data } = resposta;
    if (notificar) {
      alert(status, "Usuário", data.mensagem);
    }
    return data.data;
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      if (notificar) {
        alert(
          error.response?.status || 500,
          request.rota,
          error.response?.data.mensagem || "Erro desconhecido",
        );
      }
    }
    return null;
  }
}

export async function temaApiRequest<Payload, Resposta = Payload>(
  request: TiposDeRequest<Payload, typeof rotasTema>,
  notificar = true,
) {
  try {
    headersComAutenticacao();
    let resposta: AxiosResponse<RespostaApi<Resposta>>;
    if (request.metodo === "post") {
      resposta = await apiRotas.post<RespostaApi<Resposta>>(
        rotasTema[request.rota],
        request.payload,
      );
    } else {
      resposta = await apiRotas.get<RespostaApi<Resposta>>(
        rotasTema[request.rota],
      );
    }
    const { status, data } = resposta;
    if (notificar) {
      alert(status, "Tema", data.mensagem);
    }
    return data.data;
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      if (notificar) {
        alert(
          error.response?.status || 500,
          request.rota,
          error.response?.data.mensagem || "Erro desconhecido",
        );
      }
    }
    return null;
  }
}

export async function jogoApiRequest<Payload, Resposta = Payload>(
  request: TiposDeRequest<Payload, typeof rotasJogo>,
  notificar = true,
) {
  try {
    headersComAutenticacao();
    let resposta: AxiosResponse<RespostaApi<Resposta>>;
    if (request.metodo === "post") {
      resposta = await apiRotas.post<RespostaApi<Resposta>>(
        rotasJogo[request.rota],
        request.payload,
      );
    } else {
      resposta = await apiRotas.get<RespostaApi<Resposta>>(
        rotasJogo[request.rota],
      );
    }
    const { status, data } = resposta;
    if (notificar) {
      alert(status, "Tema", data.mensagem);
    }
    return data.data;
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      if (notificar) {
        alert(
          error.response?.status || 500,
          request.rota,
          error.response?.data.mensagem || "Erro desconhecido",
        );
      }
    }
    return null;
  }
}
