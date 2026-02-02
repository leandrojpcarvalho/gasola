import { belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import { IPalavra, EDificuldade } from 'jogodaforca-shared'
import Tema from './tema.js'
import ModeloBase from './modelo_base.js'

export default class Palavra extends ModeloBase implements IPalavra {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare dificuldade: EDificuldade

  @column()
  declare dicas: string[]

  @column()
  declare valor: string

  @column({ columnName: 'id_tema' })
  declare idTema: number

  @column({ columnName: 'dica_gerada_por_ia' })
  declare dicaGeradaPorIA: string | null

  @belongsTo(() => Tema)
  declare tema: BelongsTo<typeof Tema>
}
