import OpenAI from 'openai'
import { RespostaIA } from './types.js'
import env from '#start/env'

export class ServicoOpenAI {
  public static getInstance() {
    const apiKey = env.get('OPEN_IA_KEY')
    if (apiKey) {
      return new ServicoOpenAI(
        new OpenAI({
          apiKey,
        })
      )
    }
    return null
  }

  private constructor(private client: OpenAI) {}

  public async gerarDica(palavra: string): Promise<RespostaIA | null> {
    const prompt = `
      Gere uma dica curta para a palavra "${palavra}".
      - Não mencione letras
      - Máx. 15 palavras
      - Defina: tema (singular) e dificuldade (fácil | médio | difícil) com base no tamanho da palavra
      - Retorne APENAS JSON no formato:
      {
        "dica": string,
        "tema": string,
        "dificuldade": string
      }
      `
    const response = await this.client.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'Responda sempre somente com JSON válido, sem texto extra.',
        },
        { role: 'user', content: prompt },
      ],
      max_completion_tokens: 70,
    })

    const respostaTexto = response.choices[0].message?.content || ''
    const respostaJSON = JSON.parse(respostaTexto)

    if (!respostaJSON.dificuldade || !respostaJSON.dica || !respostaJSON.tema) {
      return null
    }

    return respostaJSON
  }

  public async gerarTema(palavra: string): Promise<string | null> {
    const prompt = `
      Qual é o tema mais apropriado para a palavra "${palavra}"?
      Responda com apenas uma palavra.
      `

    const response = await this.client.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'Responda sempre com apenas uma palavra, sem texto extra.',
        },
        { role: 'user', content: prompt },
      ],
      max_completion_tokens: 10,
    })

    const tema = response.choices[0].message?.content?.trim() || ''

    if (!tema) {
      return null
    }

    return tema
  }
}
