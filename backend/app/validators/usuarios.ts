import { EDificuldade } from 'jogodaforca-shared'
import vine from '@vinejs/vine'

export const criarUsuarioSchema = vine.create({
  dificuldade: vine.enum(EDificuldade),
  email: vine.string().email(),
  nome: vine.string().minLength(3).maxLength(100),
  senha: vine.string().minLength(6).maxLength(100),
})

export const loginUsuarioSchema = vine.create({
  email: vine.string().email(),
  senha: vine.string().minLength(6).maxLength(100),
})
