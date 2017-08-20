import * as express from "express";
import * as http from "http";
import * as socketIo from "socket.io";
import * as redis from 'socket.io-redis';
import * as logger from 'morgan';
import * as cookieParser from 'cookie-parser';
import * as bodyParser from 'body-parser';

import { UserFunctions } from './services/user';

import { SpotifyService } from './services/spotify';
import { NowPlayingService } from './services/now-playing';

class Server {
    public static readonly REDIS_HOST = 'localhost';
    public static readonly PORT: number = 8080;
    public static readonly APP_PREFIX: string = "HJBV";
    public app: any;
    private server: any;
    private io: SocketIO.Server;
    private spotify: SpotifyService;
    private nowPlaying: NowPlayingService;
    private redisHost: string;
    private port: number;

    public static bootstrap(): Server {
        return new Server().bootstrap();
    }

    constructor() {
        this.createApp();
        this.config();
        this.createServer();
        this.sockets();
        this.services();
        this.listen();
    }

    private bootstrap(): Server {

        return this;
    }

    private createApp(): void {
        this.app = express();
    }

    private createServer(): void {
        this.server = http.createServer(this.app);
    }

    private config(): void {
        this.port = parseInt(process.env.PORT) || Server.PORT;
        this.redisHost = process.env.REDIS_HOST || Server.REDIS_HOST;
        console.log("Redis Host : " + this.redisHost);
    }

    private sockets(): void {
        try {
            this.io = socketIo(this.server);
            this.io.adapter(redis({ host: this.redisHost, port: 6379 }));

            this.io.of('/').adapter.on('error', function(error){ console.log(error) });
        }
        catch(e)
        {
            this.io = socketIo(this.server);
        }
        this.io.on("Test", (val: string) => {
            console.log(val);
        });


        // console.log(this.io.adapter());

    }

    private services(): void {
        this.spotify = SpotifyService.bootstrap();
        this.nowPlaying = NowPlayingService.bootstrap();
    }

    private listen(): void {
        this.server.listen(this.port, () => {
            console.log('Running server on port %s', this.port);
        });

        this.io.on('connect', (socket: SocketIO.Socket) => {
            let connectedUserMap: Map<string, any> = UserFunctions.getMap();
            connectedUserMap.set(socket.id, { status:'online', name: 'none' });

            console.log('Connected client on port %s.', this.port);
            console.log('Connected client id : %s.', socket.id);

            socket.on('recieveUserName', (data) => {
                let user = connectedUserMap.get(socket.id);
                user.name = data.name;
                console.log('Connected client name : %s.', user.name);
                this.spotify.register_hooks(this.io, socket, Server.APP_PREFIX);
                this.nowPlaying.register_hooks(this.io, socket, Server.APP_PREFIX);
                this.io.emit("Test","Test");
            });
            socket.on('disconnect', () => {
                console.log('Client disconnected');
                let user = connectedUserMap.get(socket.id);
                user.status = 'offline';
            });
        });
    }
}

const server = Server.bootstrap();
const app = server.app;
export default app;