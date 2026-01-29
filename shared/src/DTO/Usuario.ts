import { EDificuldade, Criacao, IUsuario } from "../index.js";
import { DateTime } from "luxon";

export class UsuarioRequestDTO implements Criacao<IUsuario> {
  public readonly nome: string;
  public readonly email: string;
  public readonly senha: string;
  public readonly dificuldade: EDificuldade;

  constructor(data: Criacao<IUsuario>) {
    this.nome = data.nome;
    this.email = data.email;
    this.senha = data.senha;
    this.dificuldade = data.dificuldade;
  }
}

export class UsuarioLoginDTO {
  public readonly email: string;
  public readonly senha: string;

  constructor(data: { email: string; senha: string }) {
    this.email = data.email;
    this.senha = data.senha;
  }
}

export class UsuarioResponseDTO implements Omit<IUsuario, "senha"> {
  public readonly id: number;
  public readonly nome: string;
  public readonly email: string;
  public readonly dificuldade: EDificuldade;
  public readonly criadoEm: DateTime;
  public readonly atualizadoEm: DateTime;

  constructor(data: IUsuario) {
    this.id = data.id;
    this.nome = data.nome;
    this.email = data.email;
    this.dificuldade = data.dificuldade;
    this.criadoEm = data.criadoEm;
    this.atualizadoEm = data.atualizadoEm;
  }
}
