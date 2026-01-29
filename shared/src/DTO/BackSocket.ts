import { EEstadoDeJogo } from "../enum";
import { BackendDTO, SessaoDeJogo } from "../type";

class AtualizarPartida {
  public readonly token: string;
  public readonly estado: EEstadoDeJogo;
  public readonly pontuacaoAtual: number;
  public readonly tentativasRestantes: number;
  public readonly acertos: number;
  public readonly letrasUsadas: string[];

  constructor(
    {
      acertos,
      estado,
      letrasUsadas,
      pontuacaoAtual,
      tentativasRestantes,
    }: SessaoDeJogo,
    token: string,
  ) {
    this.token = token;
    this.estado = estado;
    this.pontuacaoAtual = pontuacaoAtual;
    this.tentativasRestantes = tentativasRestantes;
    this.acertos = acertos;
    this.letrasUsadas = letrasUsadas;
  }
}

export const dtoBack: Record<BackendDTO, object> = {
  ATUALIZAR_PARTIDA: AtualizarPartida,
};
