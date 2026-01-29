import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'palavras'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.timestamp('criado_em').defaultTo('NOW()')
      table.timestamp('atualizado_em').defaultTo('NOW()')

      table.string('valor').notNullable()
      table.enum('dificuldade', ['fácil', 'médio', 'difícil']).notNullable()
      table.specificType('dicas', 'text[]').notNullable()
      table.integer('id_tema').unsigned().notNullable().references('id').inTable('temas')
      table.text('dica_gerada_por_ia').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
