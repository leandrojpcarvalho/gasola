import OpenAI from 'openai'
import { RespostaIA } from './types.js'
import env from '#start/env'
import { gerarPalavraResponseSchema } from './schemas.js'

/**
 * Remove markdown code blocks da resposta da OpenAI
 */
function limparRespostaJSON(texto: string): string {
  return texto
    .replace(/```json\s*/g, '')
    .replace(/```\s*/g, '')
    .trim()
}

export class ServicoOpenAI {
  public static getInstance() {
    const apiKey = env.get('OPENAI_API_KEY')
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
    const respostaJSON = JSON.parse(limparRespostaJSON(respostaTexto))

    if (!respostaJSON.dificuldade || !respostaJSON.dica || !respostaJSON.tema) {
      return null
    }

    return respostaJSON
  }

  public async gerarPalavra(tema: string): Promise<
    {
      valor: string
      dicas: string[]
      dificuldade: string
    }[]
  > {
    const prompt = `
      Monte um  array com 3 de objetos JSON com palavras diferentes relacionada ao tema fornecido.
      "valor": Gere uma palavras relacionada ao tema "${tema}".
      A palavra deve ter entre 5 e 12 letras.
      "dicas": Gere 3 dicas curtas para a palavra.
      "dificuldade": Defina a dificuldade (fácil | médio | difícil) com base no tamanho da palavra e repetição das letras.
      Retorne APENAS JSON no formato:
      [{
        "valor": string,
        "dicas": [string, string, string],
        "dificuldade": string
    }]
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
      max_completion_tokens: 450,
    })

    const respostaTexto = response.choices[0].message?.content || ''
    const respostaJSON = JSON.parse(limparRespostaJSON(respostaTexto))

    const [errors, validated] = await gerarPalavraResponseSchema.tryValidate(respostaJSON)
    if (errors || !validated) {
      throw new Error('Resposta da OpenAI não é válida')
    }
    return validated
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
