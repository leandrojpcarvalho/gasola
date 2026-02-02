import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'jogos'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.timestamp('criado_em').defaultTo('NOW()')
      table.timestamp('atualizado_em').defaultTo('NOW()')

      table.integer('id_usuario').unsigned().notNullable().references('id').inTable('usuarios')
      table.integer('id_palavra').unsigned().notNullable().references('id').inTable('palavras')
      table.integer('pontuacao').notNullable()
      table.enum('dificuldade', ['fácil', 'médio', 'difícil']).notNullable()
      table.enum('resultado', ['vitória', 'derrota', 'ativo']).notNullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
