import { EDificuldade } from 'jogodaforca-shared'

const indicesDePontuacao: Record<EDificuldade, number> = {
  [EDificuldade.FACIL]: 0.5,
  [EDificuldade.MEDIO]: 0.6,
  [EDificuldade.DIFICIL]: 0.7,
}

export function calcularPontuacaoMaxima(nivel: EDificuldade, quantidadeDeLetras: number): number {
  const indice = indicesDePontuacao[nivel]
  return Math.floor(100 * indice) * quantidadeDeLetras
}

type PenalidadeParametros = {
  nivel: EDificuldade
  comprimentoDaPalavra: number
  quantidadeDeErros: number
}

export function calcularPenalidadePorErro({
  comprimentoDaPalavra,
  nivel,
  quantidadeDeErros,
}: PenalidadeParametros): number {
  const pontuacaoMaxima = calcularPontuacaoMaxima(nivel, comprimentoDaPalavra)
  return Math.floor(pontuacaoMaxima - pontuacaoMaxima * quantidadeDeErros * 0.2)
}
