import { wsService } from '#services/Socket/ws_service'
import app from '@adonisjs/core/services/app'
import { socketIo } from '#services/Socket/ws'

console.log('🔌 Inicializando Socket.IO...')

const httpServer = await app.container.make('server')

socketIo.boot(httpServer.getNodeServer())

console.log('✅ Socket.IO inicializado')

wsService.inicializar()

console.log('✅ WsService inicializado e pronto para conexões')

export default wsService
