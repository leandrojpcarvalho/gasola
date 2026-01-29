import { BaseModel, column } from '@adonisjs/lucid/orm'
import { ITema } from 'jogodaforca-shared'
import ModeloBase from './modelo_base.js'

export default class Tema extends ModeloBase implements ITema {
  @column()
  declare valor: string
}
