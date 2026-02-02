import { GoogleGenerativeAI } from '@google/generative-ai'
import { EDificuldade } from 'jogodaforca-shared'
import env from '#start/env'
import { gerarPalavraResponseSchema } from './schemas.js'
import type { ServiceIAInterface, PalavraGerada, DicaGerada } from './ia_service.interface.js'

/**
 * Remove markdown code blocks da resposta do Gemini
 */
function limparRespostaJSON(texto: string): string {
  return texto
    .replace(/```json\s*/g, '')
    .replace(/```\s*/g, '')
    .trim()
}

export class ServicoGemini implements ServiceIAInterface {
  public readonly providerName = 'Gemini'
  private apiKey: string | null
  private model = 'gemini-1.5-pro' // Modelo disponível na API

  public static getInstance(): ServicoGemini | null {
    const apiKey = env.get('GEMINI_API_KEY')
    if (apiKey) {
      return new ServicoGemini(apiKey)
    }
    return null
  }

  private constructor(apiKey: string) {
    this.apiKey = apiKey
  }

  private getClient(): GoogleGenerativeAI {
    if (!this.apiKey) {
      throw new Error('Gemini API key não configurada')
    }
    return new GoogleGenerativeAI(this.apiKey)
  }

  public isAvailable(): boolean {
    return this.apiKey !== null
  }

  public async gerarDica(palavra: string): Promise<DicaGerada | null> {
    const client = this.getClient()
    const model = client.getGenerativeModel({ model: this.model })

    const prompt = `
      Gere uma dica curta para a palavra "${palavra}".
      - Não mencione letras
      - Máximo 15 palavras
      - Retorne APENAS JSON no formato:
      {
        "dica": string
      }
      `

    const result = await model.generateContent(prompt)
    const respostaTexto = result.response.text()
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
    const model = client.getGenerativeModel({ model: this.model })

    const prompt = `
      Monte um array com ${quantidade} objetos JSON com palavras diferentes relacionadas ao tema fornecido.
      "valor": Gere uma palavra relacionada ao tema "${tema}".
      A palavra deve ter entre 5 e 12 letras.
      "dicas": Gere 3 dicas curtas para a palavra (máximo 10 palavras cada).
      "dificuldade": Defina a dificuldade (fácil | médio | difícil) com base no tamanho da palavra e repetição das letras.
      Retorne APENAS JSON no formato:
      [{
        "valor": string,
        "dicas": [string, string, string],
        "dificuldade": string
      }]
      `

    const result = await model.generateContent(prompt)
    const respostaTexto = result.response.text()
    const respostaJSON = JSON.parse(limparRespostaJSON(respostaTexto))

    const [errors, validated] = await gerarPalavraResponseSchema.tryValidate(respostaJSON)
    if (errors || !validated) {
      throw new Error('Resposta do Gemini não é válida')
    }

    // Mapear strings para enum EDificuldade
    return validated.map((palavra) => ({
      ...palavra,
      dificuldade: palavra.dificuldade as EDificuldade,
    }))
  }
}
