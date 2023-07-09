import { io, Socket } from "socket.io-client";

export class WS {
  private static instance: WS;
  public socket!: Socket;

  constructor(ip: string) {
    this.socket = io(ip);
  }

  public static getInstance(ip: string): WS {
    return this.instance || (this.instance = new this(ip));
  }
  emit(event: string, data: any) {
    this.socket.emit(event, data);
  }
  on(event: string, data: any) {
    this.socket.on(event, data);
  }
  off(event: string, data?: any) {
    this.socket.off(event, data);
  }
}
