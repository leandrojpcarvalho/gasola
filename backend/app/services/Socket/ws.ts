import { Server } from 'socket.io'
import { Server as HttpServer } from 'node:http'

class Ws {
  public io: Server | null = null

  public boot(httpServer?: HttpServer) {
    if (this.io) return

    this.io = new Server(httpServer, {
      cors: {
        origin: '*',
        credentials: true,
      },
    })
  }
}

export const socketIo = new Ws()
