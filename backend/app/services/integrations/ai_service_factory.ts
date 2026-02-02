import type { ServiceIAInterface } from './ia_service.interface.js'
import { ServicoOpenAI } from './open_ai.js'
import { ServicoGemini } from './gemini.js'

/**
 * Factory que retorna o serviço de IA disponível
 * Prioridade: OpenAI > Gemini > null
 */
export class AIServiceFactory {
  private static instance: ServiceIAInterface | null | undefined = undefined

  /**
   * Retorna uma instância do serviço de IA disponível
   * @returns Serviço de IA ou null se nenhum estiver configurado
   */
  public static getInstance(): ServiceIAInterface | null {
    // Cache da instância
    if (this.instance !== undefined) {
      return this.instance
    }

    // Depois tenta OpenAI
    const openai = ServicoOpenAI.getInstance()
    if (openai && openai.isAvailable()) {
      console.log('✅ Usando OpenAI como provedor de IA')
      this.instance = openai
      return this.instance
    }

    // Tenta Gemini primeiro
    const gemini = ServicoGemini.getInstance()
    if (gemini && gemini.isAvailable()) {
      console.log('✅ Usando Gemini como provedor de IA')
      this.instance = gemini
      return this.instance
    }

    // Nenhum serviço disponível
    console.warn('⚠️  Nenhum serviço de IA configurado (OPENAI_API_KEY ou GEMINI_API_KEY)')
    this.instance = null
    return null
  }

  /**
   * Força recarregar a instância (útil para testes)
   */
  public static reset(): void {
    this.instance = undefined
  }

  /**
   * Verifica se algum serviço de IA está disponível
   */
  public static isAvailable(): boolean {
    return this.getInstance() !== null
  }

  /**
   * Retorna o nome do provedor atual
   */
  public static getProviderName(): string | null {
    const service = this.getInstance()
    return service?.providerName ?? null
  }
}
