import { SessaoDeJogo } from 'jogodaforca-shared'
import redis from '@adonisjs/redis/services/main'

type BuscarJogo = { idUsuario: number; idPalavra: number } | SessaoDeJogo

export class RedisJogoModelo {
  constructor(private model = redis) {}

  async cadastrarEAtualizarJogo(dadosJogo: SessaoDeJogo): Promise<string> {
    return await this.model.set(this.gerarChave(dadosJogo), JSON.stringify(dadosJogo))
  }

  async pegarJogo(jogo: BuscarJogo): Promise<SessaoDeJogo | null> {
    const dadosJogo = await this.model.get(this.gerarChave(jogo))
    if (!dadosJogo) {
      return null
    }
    return JSON.parse(dadosJogo) as SessaoDeJogo
  }

  async deletarJogo(jogo: BuscarJogo): Promise<number> {
    return await this.model.del(this.gerarChave(jogo))
  }

  private gerarChave(jogo: BuscarJogo): string {
    if ('palavra' in jogo) {
      return `${jogo.idUsuario}:${jogo.palavra.id}`
    }
    return `${jogo.idUsuario}:${jogo.idPalavra}`
  }
}
