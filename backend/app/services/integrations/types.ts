import { EDificuldade } from 'jogodaforca-shared'

export type RespostaAPIPalavra = {
  word: string
  xml: string
  normalized: string
  derived_from: string | null
}

export type RespostaAPIPalavraAleatoria = {
  word: string
  wid: number
  sense: number
}

export type PalavraNormalizada = {
  word: string
  gender: string | null
  usage: string | null
  definitions: string[]
  etymology: string | null
  derived_from: string | null
  normalized: string
}

export type Sense = {
  gramGrp?: string
  def?: string
  usg?: string
}

export type RespostaIA = {
  dica: string
  tema: string
  dificuldade: EDificuldade
}
