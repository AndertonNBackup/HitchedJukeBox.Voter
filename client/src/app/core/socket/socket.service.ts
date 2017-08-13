import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import * as io from 'socket.io-client';

@Injectable()
export class SocketService {
    private url = 'ws://127.0.0.1:8080';
    private socket: SocketIOClient.Socket;

    constructor() {
        this.socket = io.connect(this.url, {
            upgrade: false,
            transports: ['websocket']
        });
    }

    sendMessage(id: string, message: object) {
        this.socket.emit(id, message);
    }

    getMessages(hook: string) {
        let observable = new Observable(observer => {

            this.socket.on(hook, (data: object) => {
                observer.next(data);
            });

            return () => {
                this.socket.disconnect();
            };
        })
        return observable;
    }
}