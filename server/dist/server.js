"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const SpotifyService = require("./services/spotify");
class Server {
    constructor() {
        this.createApp();
        this.config();
        this.createServer();
        this.sockets();
        this.services();
        this.listen();
    }
    static bootstrap() {
        return new Server();
    }
    createApp() {
        this.app = express();
    }
    createServer() {
        this.server = http.createServer(this.app);
    }
    config() {
        this.port = parseInt(process.env.PORT) || Server.PORT;
    }
    sockets() {
        this.io = socketIo(this.server);
    }
    services() {
        this.spotify = SpotifyService;
    }
    listen() {
        this.server.listen(this.port, () => {
            console.log('Running server on port %s', this.port);
        });
        this.io.on('connect', (socket) => {
            console.log('Connected client on port %s.', this.port);
            socket.on('message', (m) => {
                console.log('[server](message): %s', JSON.stringify(m));
                this.io.emit('message', m);
            });
            socket.on('disconnect', () => {
                console.log('Client disconnected');
            });
        });
    }
}
Server.PORT = 8080;
const server = Server.bootstrap();
const app = server.app;
exports.default = app;
