import { EDificuldade, ESocketEventos } from "../enum";
import { FrontendDTO } from "../type";

class ConectarDTO {
  public readonly token: string;

  constructor(token: string) {
    this.token = token;
  }
}

class DesconectarDTO {
  public readonly token: string;

  constructor(token: string) {
    this.token = token;
  }
}

class NovoJogoDTO {
  public readonly dificuldade: EDificuldade;
  public readonly token: string;
  public readonly temaId: number;

  constructor(dificuldade: EDificuldade, token: string, temaId: number) {
    this.dificuldade = dificuldade;
    this.token = token;
    this.temaId = temaId;
  }
}

class JogadaDTO {
  public readonly letra: string;
  public readonly jogoId: string;
  public readonly token: string;

  constructor(letra: string, jogoId: string, token: string) {
    this.letra = letra;
    this.jogoId = jogoId;
    this.token = token;
  }
}

class FinalizarJogoDTO {
  public readonly jogoId: string;
  public readonly token: string;

  constructor(jogoId: string, token: string) {
    this.jogoId = jogoId;
    this.token = token;
  }
}

export const dtoFront: Record<FrontendDTO, object> = {
  CONECTAR: ConectarDTO,
  DESCONECTAR: DesconectarDTO,
  NOVO_JOGO: NovoJogoDTO,
  JOGADA: JogadaDTO,
  FINALIZAR_JOGO: FinalizarJogoDTO,
};
