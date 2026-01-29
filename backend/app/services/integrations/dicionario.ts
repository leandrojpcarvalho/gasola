import { XMLParser } from 'fast-xml-parser'
import {
  PalavraNormalizada,
  RespostaAPIPalavra,
  RespostaAPIPalavraAleatoria,
  Sense,
} from './types.js'

enum EndpointDicionario {
  BASE = 'https://api.dicionario-aberto.net/',
  PALAVRA = 'word',
  ALEATORIO = 'random',
}

export class Dicionario {
  private pegarPalavra(string: string): string {
    return `${EndpointDicionario.BASE}${EndpointDicionario.PALAVRA}/${string}/1`
  }

  private pegarPalavraAleatoria(): string {
    return `${EndpointDicionario.BASE}${EndpointDicionario.ALEATORIO}`
  }

  private conversorXmlRespostaPalavraParaJSON(
    xml: string
  ): Omit<PalavraNormalizada, 'derived_from' | 'normalized'> {
    const parser = new XMLParser({
      ignoreAttributes: false,
      attributeNamePrefix: '@_',
      trimValues: true,
    })

    const entry = parser.parse(xml).entry

    const word = entry.form?.orth ?? null
    const etymology = entry.etym?._ ?? null

    const sensesRaw = entry.sense ? (Array.isArray(entry.sense) ? entry.sense : [entry.sense]) : []

    const senses = sensesRaw.map((sense: Sense) => ({
      gender: sense.gramGrp ?? null,
      usage: sense.usg ?? null,
      definition: sense.def ?? null,
    }))

    return {
      word,
      gender: senses[0]?.gender ?? null,
      usage: senses[0]?.usage ?? null,
      definitions: senses.map((s: any) => s.definition).filter(Boolean),
      etymology,
    }
  }

  async buscarPalavra(string: string): Promise<PalavraNormalizada | false> {
    const resposta = await fetch(this.pegarPalavra(string))
    if (!resposta.ok) {
      return false
    }
    const json = (await resposta.json()) as RespostaAPIPalavra[]
    const data = json[0]
    const xmlConvertido = this.conversorXmlRespostaPalavraParaJSON(data.xml)

    return {
      ...xmlConvertido,
      derived_from: data.derived_from,
      normalized: data.normalized,
    }
  }

  async buscarPalavraAleatoria(): Promise<PalavraNormalizada | false> {
    const resposta = await fetch(this.pegarPalavraAleatoria())
    if (!resposta.ok) {
      return false
    }
    const dados = (await resposta.json()) as RespostaAPIPalavraAleatoria

    return await this.buscarPalavra(dados.word)
  }
}
