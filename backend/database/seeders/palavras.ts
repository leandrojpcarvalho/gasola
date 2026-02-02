import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Palavra from '#models/palavra'
import { EDificuldade } from 'jogodaforca-shared'

export default class extends BaseSeeder {
  async run() {
    await Palavra.createMany([
      // ======================
      // Tema 1 — Programação
      // ======================
      {
        valor: 'javascript',
        dificuldade: EDificuldade.FACIL,
        dicas: ['Linguagem muito usada na web', 'Roda no navegador', 'Base de vários frameworks'],
        idTema: 1,
        dicaGeradaPorIA: null,
      },
      {
        valor: 'typescript',
        dificuldade: EDificuldade.MEDIO,
        dicas: ['Superset do JavaScript', 'Possui tipagem estática', 'Ajuda a evitar erros'],
        idTema: 1,
        dicaGeradaPorIA: 'É como JavaScript, mas com regras mais claras.',
      },
      {
        valor: 'backend',
        dificuldade: EDificuldade.MEDIO,
        dicas: [
          'Parte que roda no servidor',
          'Lida com regras de negócio',
          'Conversa com banco de dados',
        ],
        idTema: 1,
        dicaGeradaPorIA: null,
      },

      // ======================
      // Tema 2 — Matemática
      // ======================
      {
        valor: 'fracao',
        dificuldade: EDificuldade.FACIL,
        dicas: [
          'Representa partes de um todo',
          'Possui numerador e denominador',
          'Muito usada no dia a dia',
        ],
        idTema: 2,
        dicaGeradaPorIA: null,
      },
      {
        valor: 'equacao',
        dificuldade: EDificuldade.MEDIO,
        dicas: ['Possui uma igualdade', 'Tem incógnitas', 'Pode ter mais de uma solução'],
        idTema: 2,
        dicaGeradaPorIA: 'É uma conta com algo desconhecido para descobrir.',
      },
      {
        valor: 'hipotenusa',
        dificuldade: EDificuldade.DIFICIL,
        dicas: [
          'Maior lado do triângulo retângulo',
          'Fica oposta ao ângulo reto',
          'Relacionada ao teorema de Pitágoras',
        ],
        idTema: 2,
        dicaGeradaPorIA: null,
      },

      // ======================
      // Tema 3 — Tecnologia
      // ======================
      {
        valor: 'internet',
        dificuldade: EDificuldade.FACIL,
        dicas: ['Rede mundial de computadores', 'Permite comunicação global', 'Base da web'],
        idTema: 3,
        dicaGeradaPorIA: null,
      },
      {
        valor: 'servidor',
        dificuldade: EDificuldade.MEDIO,
        dicas: ['Responde requisições', 'Fica sempre ligado', 'Pode hospedar sites'],
        idTema: 3,
        dicaGeradaPorIA: null,
      },
      {
        valor: 'criptografia',
        dificuldade: EDificuldade.DIFICIL,
        dicas: ['Protege informações', 'Usa chaves', 'Muito usada em segurança'],
        idTema: 3,
        dicaGeradaPorIA: 'Transforma dados para que só o destinatário entenda.',
      },

      // ======================
      // Tema 4 — Jogos
      // ======================
      {
        valor: 'xadrez',
        dificuldade: EDificuldade.FACIL,
        dicas: ['Jogo de tabuleiro', 'Possui rei e rainha', 'Exige estratégia'],
        idTema: 4,
        dicaGeradaPorIA: null,
      },
      {
        valor: 'videogame',
        dificuldade: EDificuldade.FACIL,
        dicas: [
          'Forma de entretenimento',
          'Pode ser jogado sozinho ou online',
          'Usa console ou computador',
        ],
        idTema: 4,
        dicaGeradaPorIA: null,
      },
      {
        valor: 'rpg',
        dificuldade: EDificuldade.MEDIO,
        dicas: ['Jogo de interpretação', 'Possui personagens', 'Pode ser de mesa ou digital'],
        idTema: 4,
        dicaGeradaPorIA: 'Os jogadores assumem papéis em uma história.',
      },

      // ======================
      // Tema 5 — Ciências
      // ======================
      {
        valor: 'atomos',
        dificuldade: EDificuldade.FACIL,
        dicas: [
          'Unidade básica da matéria',
          'Possui prótons e elétrons',
          'Forma tudo ao nosso redor',
        ],
        idTema: 5,
        dicaGeradaPorIA: null,
      },
      {
        valor: 'gravidade',
        dificuldade: EDificuldade.MEDIO,
        dicas: ['Força da natureza', 'Atrai corpos', 'Nos mantém no chão'],
        idTema: 5,
        dicaGeradaPorIA: null,
      },
      {
        valor: 'fotossintese',
        dificuldade: EDificuldade.DIFICIL,
        dicas: ['Processo das plantas', 'Produz energia', 'Usa luz solar'],
        idTema: 5,
        dicaGeradaPorIA: 'As plantas produzem seu próprio alimento usando luz.',
      },
    ])
  }
}
