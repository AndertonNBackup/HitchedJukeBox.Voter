"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const SpotifyWebApi = require("spotify-web-api-node");
class SpotifyService {
    static bootstrap() {
        return new SpotifyService().bootstrap();
    }
    constructor() {
        this.config();
    }
    bootstrap() {
        this.setup_key();
        return this;
    }
    config() {
        console.log('Spotify Service Initiated!');
        this.spotify = new SpotifyWebApi({
            clientId: '4658a83f5b35440398ea4f3590979658',
            clientSecret: 'f4c1782bf58446518647dd2c9a272bc2'
        });
    }
    setup_key() {
        this.spotify.clientCredentialsGrant()
            .then((data) => {
            // Save the access token so that it's used in future calls
            this.spotify.setAccessToken(data.body['access_token']);
            let expiry = parseInt(data.body['expires_in']) - 10;
            clearTimeout(this.timer);
            this.timer = setTimeout(() => {
                this.setup_key();
            }, expiry * 1000);
            console.log('The access token is ' + data.body['access_token']);
        }, (err) => {
            console.log('Something went wrong when retrieving an access token: ', err);
        });
    }
    register_hooks(socket) {
        socket.on('test_hook', (value) => {
            this.setup_key();
            return true;
        });
    }
}
exports.SpotifyService = SpotifyService;
