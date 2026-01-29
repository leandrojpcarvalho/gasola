import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'usuarios'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.timestamp('criado_em').defaultTo('NOW()')
      table.timestamp('atualizado_em').defaultTo('NOW()')

      table.string('nome').notNullable()
      table.string('email').notNullable().unique()
      table.string('senha').notNullable()
      table.enum('dificuldade', ['fácil', 'médio', 'difícil']).notNullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
