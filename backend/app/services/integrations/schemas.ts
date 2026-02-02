import vine from '@vinejs/vine'

/**
 * Schemas para validação de respostas de APIs externas
 */

// Schema para validar resposta da OpenAI ao gerar palavras
export const palavraItemSchema = vine.object({
  valor: vine.string().minLength(1).maxLength(50),
  dicas: vine.array(vine.string()).fixedLength(3),
  dificuldade: vine.enum(['fácil', 'médio', 'difícil']),
})

export const gerarPalavraResponseSchema = vine.create(vine.array(palavraItemSchema).minLength(1))
