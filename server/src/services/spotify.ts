import * as logger from 'morgan';
import * as socketIo from "socket.io";
import * as SpotifyWebApi from 'spotify-web-api-node';

export class SpotifyService {
    private spotify: any;
    private timer: NodeJS.Timer;

    public static bootstrap(): SpotifyService {
        return new SpotifyService().bootstrap();
    }

    constructor() {
        this.config();
    }

    private bootstrap(): SpotifyService {
        this.setup_key();
        return this;
    }

    private config(): void {
        console.log('Spotify Service Initiated!');
        this.spotify = new SpotifyWebApi({
            clientId: '4658a83f5b35440398ea4f3590979658',
            clientSecret: 'f4c1782bf58446518647dd2c9a272bc2'
        });
    }

    public setup_key(): void {
        this.spotify.clientCredentialsGrant()
        .then((data) => {
            // Save the access token so that it's used in future calls
            this.spotify.setAccessToken(data.body['access_token']);
            let expiry: number = parseInt(data.body['expires_in']) - 10;

            clearTimeout(this.timer);
            this.timer = setTimeout(() => {
                this.setup_key();
            }, expiry * 1000);

            console.log('The access token is ' + data.body['access_token']);

        }, (err) => {
            console.log('Something went wrong when retrieving an access token: ', err);
        });
    }

    public register_hooks(socket: SocketIO.Socket): void {
        socket.on('test_hook', (value: any) => {
            this.setup_key();
            return true;
        });
    }
}