import { EEstadoDeJogo, ESocketEventos } from "./enum.js";
import { IUsuario } from "./interface.js";

export type Jogo = {
  id: number;
  usuario: string;
  palavra: string;
  pontuacao: number;
};

export type SessaoDeJogo = {
  idJogo: number;
  palavra: {
    id: number;
    valor: string;
  };
  idUsuario: number;
  letrasUsadas: string[];
  dicasUtilizadas: number;
  acertos: number;
  pontuacaoAtual: number;
  tentativasRestantes: number;
  estado: EEstadoDeJogo;
};

export type Ranking = {
  posicao: number;
  nome: string;
  pontuacaoTotal: number;
};

export type NovoUsuario = Criacao<IUsuario>;
export type LoginUsuario = Omit<NovoUsuario, "nome" | "dificuldade">;

export type Tentativa = {
  letra: string;
  idUsuario: number;
  idPalavra: number;
};

export type RespostaTentativa = {
  correta: boolean;
  pontuacao: number;
  mensagem: string;
  estadoAtual: EEstadoDeJogo;
};

export type Criacao<T> = Omit<T, "id" | "criadoEm" | "atualizadoEm">;

export type FrontendDTO = keyof Omit<
  typeof ESocketEventos,
  "ATUALIZAR_PARTIDA"
>;

export type BackendDTO = keyof Omit<
  typeof ESocketEventos,
  "CONECTAR" | "DESCONECTAR" | "NOVO_JOGO" | "JOGADA" | "FINALIZAR_JOGO"
>;
