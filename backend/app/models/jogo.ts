import { belongsTo, column } from '@adonisjs/lucid/orm'
import { EEstadoDeJogo, IJogo } from 'jogodaforca-shared'
import Usuario from './usuario.js'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Palavra from './palavra.js'
import ModeloBase from './modelo_base.js'

export default class Jogo extends ModeloBase implements IJogo {
  @column()
  declare idUsuario: number

  @column()
  declare idPalavra: number

  @column()
  declare pontuacao: number

  @column()
  declare resultado: EEstadoDeJogo

  @belongsTo(() => Usuario)
  declare usuario: BelongsTo<typeof Usuario>

  @belongsTo(() => Palavra)
  declare palavra: BelongsTo<typeof Palavra>
}
