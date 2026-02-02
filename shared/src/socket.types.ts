
// region  Tipos do frontend Socket
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

//endregion

// region Tipos do backend Socket

export type ErroRespostaApi = {
  sucesso: false;
  mensagem: string;
};

type SucessoRespostaTipo =
  | "carregado"
  | "finalizado"
  | "desconectado"
  | "inicializado";

export type SucessoRespostaApi<T, R extends SucessoRespostaTipo> = {
  sucesso: true;
  type: R;
  dado: T;
};

export type RespostaApi<T, R extends SucessoRespostaTipo> =
  | ErroRespostaApi
  | SucessoRespostaApi<T, R>;

export type Estado = Omit<SessaoDeJogo, "palavra" | "idUsuario"> & {
  palavra: string[];
};

type RespostaConectarDado = {
  ia: boolean;
  message: string;
};

export type RespostaConectar = RespostaApi<
  RespostaConectarDado,
  "inicializado"
>;
export type RespostaDesconectar = RespostaApi<number, "desconectado">;
export type RespostaFinalizarJogo = RespostaApi<number, "finalizado">;
export type RespostaCarregarJogo = RespostaApi<Estado, "carregado">;

export type RespostaAtualizarJogo =
  | RespostaFinalizarJogo
  | RespostaCarregarJogo
  | RespostaCarregarJogo;

// endregion