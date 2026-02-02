import { BaseSeeder } from '@adonisjs/lucid/seeders'
import TemaSeeder from './tema_seeder.js'
import PalavrasSeeder from './palavras.js'

export default class extends BaseSeeder {
  private async seed(Seeder: typeof BaseSeeder) {
    await new Seeder(this.client).run()
  }

  async run() {
    await this.seed(TemaSeeder)
    await this.seed(PalavrasSeeder)
  }
}
