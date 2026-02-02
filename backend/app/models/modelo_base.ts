import { BaseModel, column } from '@adonisjs/lucid/orm'
import { DateTime } from 'luxon'

export default class ModeloBase extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column.dateTime({ autoCreate: true, columnName: 'criado_em' })
  declare criadoEm: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true, columnName: 'atualizado_em' })
  declare atualizadoEm: DateTime
}
