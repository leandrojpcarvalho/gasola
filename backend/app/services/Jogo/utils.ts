import { EDificuldade } from 'jogodaforca-shared'

const indicesDePontuacao: Record<EDificuldade, number> = {
  [EDificuldade.FACIL]: 0.5,
  [EDificuldade.MEDIO]: 1,
  [EDificuldade.DIFICIL]: 1.5,
}

export function calcularPontuacaoMaxima(nivel: EDificuldade, palavra: string): number {
  const indice = indicesDePontuacao[nivel]
  return Math.floor(
    (100 * indice * quantidadeDeLetras(palavra)) / quantidadeDeLetrasRepetidas(palavra)
  )
}

function quantidadeDeLetrasRepetidas(palavra: string): number {
  const letrasUnicas = new Set<string>(palavra.split(''))
  return letrasUnicas.size
}

function quantidadeDeLetras(palavra: string): number {
  return palavra.length
}

type PenalidadeParametros = {
  nivel: EDificuldade
  palavra: string
  quantidadeDeErros: number
}

export function calcularPenalidadePorErro({
  palavra,
  nivel,
  quantidadeDeErros,
}: PenalidadeParametros): number {
  const pontuacaoMaxima = calcularPontuacaoMaxima(nivel, palavra)
  const pontos = Math.floor(pontuacaoMaxima - pontuacaoMaxima * quantidadeDeErros * 0.1)
  return pontos < 0 ? 0 : pontos
}
