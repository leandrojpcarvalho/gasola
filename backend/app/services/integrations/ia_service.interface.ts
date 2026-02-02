import type { EDificuldade } from 'jogodaforca-shared'

/**
 * Resposta da geração de palavras por IA
 */
export type PalavraGerada = {
  valor: string
  dicas: string[]
  dificuldade: EDificuldade
}

/**
 * Resposta da geração de dica por IA
 */
export type DicaGerada = {
  dica: string
}

/**
 * Interface para serviços de IA (OpenAI, Gemini, etc)
 */
export interface ServiceIAInterface {
  /**
   * Gera palavras e dicas para um tema
   * @param tema Tema para gerar as palavras
   * @param quantidade Quantidade de palavras a gerar (padrão: 3)
   * @returns Array de palavras geradas com dicas
   */
  gerarPalavras(tema: string, quantidade?: number): Promise<PalavraGerada[] | null>

  /**
   * Gera uma dica adicional para uma palavra
   * @param palavra Palavra para gerar a dica
   * @returns Dica gerada
   */
  gerarDica(palavra: string): Promise<DicaGerada | null>

  /**
   * Verifica se o serviço está disponível (chave API configurada)
   * @returns true se está configurado
   */
  isAvailable(): boolean

  /**
   * Nome do provedor (para logs)
   */
  readonly providerName: string
}
