import * as express from "express";
import * as http from "http";
import * as socketIo from "socket.io";
import * as redis from 'socket.io-redis';
import * as logger from 'morgan';
import * as cookieParser from 'cookie-parser';
import * as bodyParser from 'body-parser';

import * as SpotifyService from './services/spotify';

class Server {
    public static readonly PORT = 8080;
    public app: any;
    private server: any;
    private io: SocketIO.Server;
    private spotify: any;
    private port: number;

    public static bootstrap(): Server {
        return new Server();
    }

    constructor() {
        this.createApp();
        this.config();
        this.createServer();
        this.sockets();
        this.services();
        this.listen();
    }

    private createApp(): void {
        this.app = express();
    }

    private createServer(): void {
        this.server = http.createServer(this.app);
    }

    private config(): void {
        this.port = parseInt(process.env.PORT) || Server.PORT;
    }

    private sockets(): void {
        this.io = socketIo(this.server);
    }

    private services(): void {
        this.spotify = SpotifyService;
    }

    private listen(): void {
        this.server.listen(this.port, () => {
            console.log('Running server on port %s', this.port);
        });

        this.io.on('connect', (socket: any) => {
            console.log('Connected client on port %s.', this.port);
            socket.on('message', (m: any) => {
                console.log('[server](message): %s', JSON.stringify(m));
                this.io.emit('message', m);
            });

            socket.on('disconnect', () => {
                console.log('Client disconnected');
            });
        });
    }
}

const server = Server.bootstrap();
const app = server.app;
export default app;