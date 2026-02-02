// Tipos do frontend Socket

import { EDificuldade } from "./enum";
import { SessaoDeJogo } from "./type";

export type SolicitarConexao = {
  idUsuario?: number;
};

export type SolicitarNovoJogo = {
  dificuldade: EDificuldade;
  idUsuario: number;
  temaId: number;
};

export type GerarJogoPorIA = {
  type: "gerar";
  tema: string;
  idUsuario: number;
};

export type GerarJogos = SolicitarNovoJogo | GerarJogoPorIA;

export type AtualizarJogo = {
  letra: string;
  idJogo: number;
};

export type SolicitarDica = {
  type: "dica";
  idJogo: number;
  geradaPorIa: boolean;
};
export type RestaurarJogo = {
  type: "restaurar";
  jogoId: number;
};

export type FinalizarJogo = {
  idJogo: number;
  type: "finalizar";
};

export type AtualizarPartidaFront =
  | AtualizarJogo
  | FinalizarJogo
  | RestaurarJogo
  | SolicitarDica;

// Tipos do backend Socket

export type ErroRespostaApi = {
  sucesso: false;
  mensagem: string;
};

export type SucessoRespostaApi<T> = {
  sucesso: true;
  dado: T;
};

export type RespostaApi<T> = ErroRespostaApi | SucessoRespostaApi<T>;

export type Estado = Omit<SessaoDeJogo, "palavra" | "idUsuario"> & {
  palavra: string[];
};

export type RespostaConectar = RespostaApi<{
  ia: boolean;
  message: string;
}>;

export type RespostaDesconectar = RespostaApi<{
  type: "desconectado";
}>;

export type RespostaFinalizarJogo = RespostaApi<{
  type: "finalizado";
  idJogo: number;
}>;

export type RespostaCarregarJogo = RespostaApi<Estado>;

export type RespostaAtualizarJogo =
  | RespostaFinalizarJogo
  | RespostaCarregarJogo
  | RespostaCarregarJogo;
