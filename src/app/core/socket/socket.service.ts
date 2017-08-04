import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import * as io from 'socket.io-client';

@Injectable()
export class SocketService {
    private url = 'ws://127.0.0.1:3000';
    private socket: SocketIOClient.Socket;

    sendMessage(message: object) {
        this.socket.emit('voter search', message);
    }

    getMessages() {
        let observable = new Observable(observer => {

            this.socket = io.connect(this.url, {
                upgrade: false,
                transports: ['websocket']
            });

            this.socket.on('voter response', (data: object) => {
                observer.next(data);
            });

            return () => {
                this.socket.disconnect();
            };
        })
        return observable;
    }
}