/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
import { middleware } from './kernel.js'

const ControleUsuario = () => import('#controllers/usuario')
const ControleTema = () => import('#controllers/tema')

router.get('/', async () => {
  return { api: 'jogo da forca' }
})

// Health check endpoint para Docker
router.get('/health', async ({ response }) => {
  return response.status(200).json({ status: 'ok', timestamp: new Date().toISOString() })
})

router
  .group(() => {
    router.post('/criar', [ControleUsuario, 'criar'])
    router.post('/login', [ControleUsuario, 'login'])
    router.post('/guest', [ControleUsuario, 'criarGuest'])
    router
      .put('/info', [ControleUsuario, 'atualizarUsuario'])
      .use(middleware.auth({ guards: ['api'] }))
    router.get('/info', [ControleUsuario, 'obterInfo']).use(middleware.auth({ guards: ['api'] }))
    router
      .get('/historico', [ControleUsuario, 'obterHistorico'])
      .use(middleware.auth({ guards: ['api'] }))
  })
  .prefix('/usuario')

router
  .group(() => {
    router.get('/listar', [ControleTema, 'listar'])
  })
  .prefix('/tema')
  .use(middleware.auth({ guards: ['api'] }))

const ControleJogo = () => import('#controllers/jogo')

router
  .group(() => {
    router.get('/ranking', [ControleJogo, 'ranking'])
  })
  .prefix('/jogo')
  .use(middleware.auth({ guards: ['api'] }))
