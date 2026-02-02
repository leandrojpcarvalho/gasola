export enum EEstadoDeJogo {
  ATIVO = "ativo",
  DERROTA = "derrota",
  VITORIA = "vitória",
}

export enum EDificuldade {
  FACIL = "fácil",
  MEDIO = "médio",
  DIFICIL = "difícil",
}

export enum EPontuacaoPorDificuldade {
  FACIL = 10,
  MEDIO = 20,
  DIFICIL = 30,
}

export enum ESocketEventos {
  CONECTAR = "conectar",
  DESCONECTAR = "desconectar",
  NOVO_JOGO = "novo_jogo",
  ATUALIZAR_PARTIDA = "atualizar_partida",
}
