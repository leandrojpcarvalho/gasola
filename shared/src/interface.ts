import { DateTime } from "luxon";
import { EDificuldade, EEstadoDeJogo } from "./enum.js";

export interface ModeloBase {
  id: number;
  criadoEm: DateTime;
  atualizadoEm: DateTime;
}

export interface IJogo extends ModeloBase {
  idUsuario: number;
  idPalavra: number;
  pontuacao: number;
  dificuldade: EDificuldade;
  resultado: EEstadoDeJogo;
}

export interface IUsuario extends ModeloBase {
  nome: string;
  email: string;
  senha: string;
  dificuldade: EDificuldade;
}

export interface IPalavra extends ModeloBase {
  valor: string;
  dificuldade: EDificuldade;
  dicas: string[];
  idTema: number;
  dicaGeradaPorIA: string | null;
}

export interface ITema extends ModeloBase {
  valor: string;
}

type Criacao<Modelo extends ModeloBase> = Omit<
  Modelo,
  "id" | "criadoEm" | "atualizadoEm"
>;

export type CriacaoUsuario = Criacao<IUsuario>;
export type CriacaoJogo = Criacao<IJogo>;
export type CriacaoPalavra = Criacao<IPalavra>;
export type CriacaoTema = Criacao<ITema>;
