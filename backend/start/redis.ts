import { defineConfig } from '@adonisjs/redis'
import Env from '../start/env.js'

const redisConfig = defineConfig({
  connection: 'main',
  connections: {
    main: {
      host: Env.get('REDIS_HOST'),
      port: Env.get('REDIS_PORT'),
      password: Env.get('REDIS_PASSWORD', ''),
      db: 0,
      keyPrefix: '',
    },
  },
})

export default redisConfig
