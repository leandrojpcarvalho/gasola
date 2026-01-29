import { Criacao } from 'jogodaforca-shared'

export interface Servico<TipoDoDado, TipoDeRetorno = TipoDoDado> {
  pegarPorId(id: number): RespostaServico<TipoDeRetorno>
  criar(dado: Criacao<TipoDoDado>): RespostaServico<TipoDeRetorno | string>
  atualiza?(id: number, dado: Atualizacao<TipoDoDado>): RespostaServico<TipoDeRetorno>
  pegarTudo?(): RespostaServico<TipoDeRetorno[]>
  deletar?(id: number): RespostaServico<null>
}

export type Atualizacao<TipoDoDado> = Partial<Criacao<TipoDoDado>>

export type RespostaServico<TipoDoDado> = Promise<Sucesso<TipoDoDado> | Falha>

export type Sucesso<TipoDoDado> = {
  mensagem: string
  codigoDeStatus: number
  data?: TipoDoDado
}

export type Falha = {
  mensagem: string
  codigoDeStatus: number
}
