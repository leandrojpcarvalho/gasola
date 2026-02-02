import OpenAI from 'openai'
import { EDificuldade } from 'jogodaforca-shared'
import { RespostaIA } from './types.js'
import env from '#start/env'
import { gerarPalavraResponseSchema } from './schemas.js'
import type { ServiceIAInterface, PalavraGerada, DicaGerada } from './ia_service.interface.js'

/**
 * Remove markdown code blocks da resposta da OpenAI
 */
function limparRespostaJSON(texto: string): string {
  return texto
    .replace(/```json\s*/g, '')
    .replace(/```\s*/g, '')
    .trim()
}

export class ServicoOpenAI implements ServiceIAInterface {
  public readonly providerName = 'OpenAI'
  private apiKey: string | null

  public static getInstance(): ServicoOpenAI | null {
    const apiKey = env.get('OPENAI_API_KEY')
    if (apiKey) {
      return new ServicoOpenAI(apiKey)
    }
    return null
  }

  private constructor(apiKey: string) {
    this.apiKey = apiKey
  }

  private getClient(): OpenAI {
    if (!this.apiKey) {
      throw new Error('OpenAI API key não configurada')
    }
    return new OpenAI({ apiKey: this.apiKey })
  }

  public isAvailable(): boolean {
    return this.apiKey !== null
  }

  public async gerarDica(palavra: string): Promise<DicaGerada | null> {
    const client = this.getClient()
    const prompt = `
      Gere uma dica curta para a palavra "${palavra}".
      - Não mencione letras
      - Máx. 15 palavras
      - Retorne APENAS JSON no formato:
      {
        "dica": string
      }
      `
    const response = await client.chat.completions.create({
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

    if (!respostaJSON.dica) {
      return null
    }

    return { dica: respostaJSON.dica }
  }

  public async gerarPalavras(
    tema: string,
    quantidade: number = 3
  ): Promise<PalavraGerada[] | null> {
    const client = this.getClient()
    const prompt = `
      Monte um array com ${quantidade} objetos JSON com palavras diferentes relacionadas ao tema fornecido.
      "valor": Gere uma palavra relacionada ao tema "${tema}".
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
    const response = await client.chat.completions.create({
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

    return validated.map((palavra) => ({
      ...palavra,
      dificuldade: palavra.dificuldade as EDificuldade,
    }))
  }

  public async gerarTema(palavra: string): Promise<string | null> {
    const client = this.getClient()
    const prompt = `
      Qual é o tema mais apropriado para a palavra "${palavra}"?
      Responda com apenas uma palavra.
      `

    const response = await client.chat.completions.create({
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
