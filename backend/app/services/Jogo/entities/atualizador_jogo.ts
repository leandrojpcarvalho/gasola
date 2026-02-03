import {
  EDificuldade,
  EEstadoDeJogo,
  Estado,
  IJogo,
  IPalavra,
  SessaoDeJogo,
  normalizarTexto,
} from 'jogodaforca-shared'
import { calcularPenalidadePorErro, calcularPontuacaoMaxima } from '../utils.js'

export class AtualizadorDeJogo {
  public readonly idJogo: number
  public readonly idUsuario: number
  public readonly idPalavra: number
  public readonly palavraDificuldade: EDificuldade
  public readonly maxTentativas: number
  private _letrasCorretas: Set<string> = new Set()
  private _letrasErradas: Set<string> = new Set()
  private _dicasUtilizadas: Set<string> = new Set()
  private _palavra: string
  private _derrotaForcada: boolean = false

  public static pegarInstancia(jogo: IJogo, palavra: IPalavra) {
    const sessaoDeJogo: SessaoDeJogo = {
      idJogo: jogo.id,
      idUsuario: jogo.idUsuario,
      palavra: {
        id: palavra.id,
        valor: palavra.valor,
        replaced: Array(palavra.valor.length).fill('_'),
        dificuldade: palavra.dificuldade,
      },
      maxTentativas: this.tentativasPorDificuldade(jogo.dificuldade),
      pontuacaoAtual: calcularPontuacaoMaxima(palavra.dificuldade, palavra.valor),
      estado: jogo.resultado,
      dicasUtilizadas: [],
      letrasCorretas: [],
      letrasErradas: [],
    }
    return new AtualizadorDeJogo(sessaoDeJogo)
  }

  public static tentativasPorDificuldade(dificuldade: EDificuldade) {
    const mapTentativas: Record<EDificuldade, number> = {
      [EDificuldade.FACIL]: 8,
      [EDificuldade.MEDIO]: 7,
      [EDificuldade.DIFICIL]: 6,
    }
    return mapTentativas[dificuldade]
  }

  constructor(jogo: SessaoDeJogo) {
    this.idJogo = jogo.idJogo
    this.idUsuario = jogo.idUsuario
    this.idPalavra = jogo.palavra.id
    this.maxTentativas = jogo.maxTentativas
    this.palavraDificuldade = jogo.palavra.dificuldade
    this._palavra = jogo.palavra.valor
    this.adicionarEmLoteNoSet(jogo.letrasCorretas, '_letrasCorretas')
    this.adicionarEmLoteNoSet(jogo.letrasErradas, '_letrasErradas')
    this.adicionarEmLoteNoSet(jogo.dicasUtilizadas, '_dicasUtilizadas')
  }

  public get dicasUtilizadas(): string[] {
    return Array.from(this._dicasUtilizadas)
  }

  private adicionarNoSet(
    str: string,
    set: '_letrasCorretas' | '_letrasErradas' | '_dicasUtilizadas'
  ) {
    this[set].add(str)
  }

  private adicionarEmLoteNoSet(
    strs: string[],
    set: '_letrasCorretas' | '_letrasErradas' | '_dicasUtilizadas'
  ) {
    strs.forEach((str) => this.adicionarNoSet(str, set))
  }

  private get estado() {
    if (this.verificarPalavraCompleta()) {
      return EEstadoDeJogo.VITORIA
    }
    if (this._derrotaForcada || this._letrasErradas.size >= this.maxTentativas) {
      return EEstadoDeJogo.DERROTA
    }
    return EEstadoDeJogo.ATIVO
  }

  private calcularPontuacaoAtual(): number {
    return this.estado === EEstadoDeJogo.DERROTA
      ? 0
      : calcularPenalidadePorErro({
          palavra: this._palavra,
          nivel: this.palavraDificuldade,
          quantidadeDeErros: this._letrasErradas.size,
        })
  }

  public get palavra() {
    const palavraSeparada = this._palavra.split('')
    return palavraSeparada.map((letra) =>
      this._letrasCorretas.has(normalizarTexto(letra)) ? letra : '_'
    )
  }

  public get jogo(): SessaoDeJogo {
    return {
      idJogo: this.idJogo,
      idUsuario: this.idUsuario,
      palavra: {
        id: this.idPalavra,
        valor: this._palavra,
        replaced: this.palavra,
        dificuldade: this.palavraDificuldade,
      },
      maxTentativas: this.maxTentativas,
      letrasCorretas: Array.from(this._letrasCorretas),
      letrasErradas: Array.from(this._letrasErradas),
      dicasUtilizadas: Array.from(this._dicasUtilizadas),
      estado: this.estado,
      pontuacaoAtual: this.calcularPontuacaoAtual(),
    }
  }

  public derrota() {
    this._derrotaForcada = true
  }

  private verificaLetra(letra: string): boolean {
    const letraNormalizada = normalizarTexto(letra)
    const palavraNormalizada = normalizarTexto(this._palavra)
    return palavraNormalizada.includes(letraNormalizada)
  }

  private verificarPalavraCompleta(): boolean {
    const palavraNormalizada = normalizarTexto(this._palavra)
    const palavraBase = new Set(palavraNormalizada.split(''))
    const letrasCorretasNormalizadas = new Set(
      Array.from(this._letrasCorretas).map((l) => normalizarTexto(l))
    )
    for (const letra of palavraBase) {
      if (!letrasCorretasNormalizadas.has(letra)) {
        return false
      }
    }
    return true
  }

  public tentarLetra(letra: string) {
    if (this.verificaLetra(letra)) {
      this._letrasCorretas.add(letra)
    } else {
      this._letrasErradas.add(letra)
    }
  }

  public usarDica(dica: string) {
    this._dicasUtilizadas.add(dica)
  }

  public get jogoEstado(): Estado {
    const estado = this.estado
    return {
      dicasUtilizadas: Array.from(this._dicasUtilizadas),
      estado,
      idJogo: this.idJogo,
      letrasCorretas: Array.from(this._letrasCorretas),
      letrasErradas: Array.from(this._letrasErradas),
      maxTentativas: this.maxTentativas,
      palavra: estado === EEstadoDeJogo.DERROTA ? this._palavra.split('') : this.palavra,
      pontuacaoAtual: this.calcularPontuacaoAtual(),
    }
  }
}
