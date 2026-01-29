import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'temas'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.timestamp('criado_em').defaultTo('NOW()')
      table.timestamp('atualizado_em').defaultTo('NOW()')

      table.string('valor').notNullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
