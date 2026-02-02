import { EDificuldade, EEstadoDeJogo, ESocketEventos } from "./enum.js";
import { ITema, IUsuario } from "./interface.js";

export type Jogo = {
  id: number;
  dificuldade: EDificuldade;
  usuario: string;
  palavra: string;
  pontuacao: number;
};

export type SessaoDeJogo = {
  idJogo: number;
  palavra: {
    id: number;
    valor: string;
    replaced: string[];
    dificuldade: EDificuldade;
  };
  idUsuario: number;
  maxTentativas: number;
  letrasCorretas: string[];
  letrasErradas: string[];
  dicasUtilizadas: string[];
  pontuacaoAtual: number;
  estado: EEstadoDeJogo;
};

export type Ranking = {
  posicao: number;
  nome: string;
  pontuacaoTotal: number;
};

export type NovoUsuario = Criacao<IUsuario>;
export type LoginUsuario = Omit<NovoUsuario, "nome" | "dificuldade">;
export type Usuario = Omit<IUsuario, "senha" | "criadoEm" | "atualizadoEm">;
export type Tema = Omit<ITema, "criadoEm" | "atualizadoEm">;

export type Tentativa = {
  letra: string;
  idJogo: number;
};

export type RespostaTentativa = {
  correta: boolean;
  pontuacao: number;
  palavra: string[];
  letrasCorretas: string[];
  letrasErradas: string[];
  mensagem: string;
  estado: EEstadoDeJogo;
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

export type SucessoOuFalha<TipoDoDado = unknown> = Sucesso<TipoDoDado> | Falha;

export type RespostaServico<TipoDoDado> = Promise<SucessoOuFalha<TipoDoDado>>;

export type Sucesso<TipoDoDado> = {
  mensagem: string;
  codigoDeStatus: number;
  data?: TipoDoDado;
};

export type Falha = {
  mensagem: string;
  codigoDeStatus: number;
};

export type Historico = {
  idJogo: number;
  palavra: string;
  pontuacao: number;
  dificuldade: EDificuldade;
  resultado: EEstadoDeJogo;
  criadoEm: string;
};
