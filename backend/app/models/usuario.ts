import { column } from '@adonisjs/lucid/orm'
import { IUsuario, EDificuldade } from 'jogodaforca-shared'
import { withAuthFinder } from '@adonisjs/auth/mixins/lucid'
import hash from '@adonisjs/core/services/hash'
import { compose } from '@adonisjs/core/helpers'
import ModeloBase from './modelo_base.js'
import { DbAccessTokensProvider } from '@adonisjs/auth/access_tokens'

const AuthFinder = withAuthFinder(() => hash.use('scrypt'), {
  uids: ['email'],
  passwordColumnName: 'senha',
})

export default class Usuario extends compose(ModeloBase, AuthFinder) implements IUsuario {
  @column()
  declare nome: string

  @column()
  declare email: string

  @column()
  declare dificuldade: EDificuldade

  @column()
  declare senha: string

  static accessTokens = DbAccessTokensProvider.forModel(Usuario, {
    expiresIn: '7 days',
    prefix: 'usr',
    table: 'usuario_tokens',
    type: 'usuario',
    tokenSecretLength: 60,
  })
}
