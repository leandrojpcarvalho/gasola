import { Server } from 'socket.io'

class Ws {
  public io: Server | null = null

  public boot() {
    if (this.io) return
    this.io = new Server(3334, {
      cors: {
        origin: '*',
      },
    })
  }
}

export const socketIo = new Ws()
