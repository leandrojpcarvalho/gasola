import { socketIo } from './ws.js'

export class WsService {
  constructor(private socket = socketIo) {
    this.socket.boot()
  }

  public conectar() {
    return this.socket.io?.on('connection', ({ client }) => {
      console.log('New client connected:', client)
    })
  }

  public desconectar() {
    return this.socket.io?.on('disconnect', ({ client }) => {
      console.log('Client disconnected:', client)
    })
  }

  public ouvirMensagens() {
    return this.socket.io?.on('listen', (data) => {
      console.log('Message received:', data)
    })
  }

  public enviarMensagem(event: string, message: any) {
    this.socket.io?.emit(event, message)
  }
}
