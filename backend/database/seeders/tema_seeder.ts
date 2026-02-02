import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Tema from '#models/tema'

export default class extends BaseSeeder {
  async run() {
    await Tema.createMany([
      { valor: 'Programação' },
      { valor: 'Matemática' },
      { valor: 'Tecnologia' },
      { valor: 'Jogos' },
      { valor: 'Ciências' },
    ])
  }
}
