/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'

const ControleUsuario = () => import('#controllers/usuario')

router.get('/', async () => {
  return { api: 'jogo da forca' }
})

router
  .group(() => {
    router.post('/criar', [ControleUsuario, 'criar'])
    router.post('/login', [ControleUsuario, 'login'])
  })
  .prefix('/usuario')
