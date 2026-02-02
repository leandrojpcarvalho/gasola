import { TransactionClientContract } from '@adonisjs/lucid/types/database'
import { Criacao, RespostaServico } from 'jogodaforca-shared'

type CriacaoModel<T> = Criacao<T> & { trx?: TransactionClientContract }
export interface Servico<TipoDoDado, TipoDeRetorno = TipoDoDado> {
  pegarPorId(id: number): RespostaServico<TipoDeRetorno>
  criar(dado: CriacaoModel<TipoDoDado>, id?: number): RespostaServico<TipoDeRetorno | string>
  atualiza?(id: number, dado: Atualizacao<TipoDoDado>): RespostaServico<TipoDeRetorno>
  pegarTudo?(): RespostaServico<TipoDeRetorno[]>
  deletar?(id: number): RespostaServico<null>
}

export type Atualizacao<TipoDoDado> = Partial<Criacao<TipoDoDado>>
