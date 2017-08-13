import * as logger from 'morgan';
import * as socketIo from "socket.io";
import * as SpotifyWebApi from 'spotify-web-api-node';

import { SpotifyRequest } from '../models/shared/spotify/spotify-request';
import { SpotifySearchRequest } from '../models/shared/spotify/spotify-search-request';
import { SpotifySearchResponse } from '../models/shared/spotify/spotify-search-response';
import { SpotifySearchResponseData } from '../models/shared/spotify/spotify-search-response-data';

export class SpotifyService {
    public static readonly SERVICE_PREFIX: string = "Spotify";

    private appPrefix: string;

    private io: SocketIO.Server;
    private spotify: SpotifyWebApi;
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

    public register_hooks(io: SocketIO.Server, socket: SocketIO.Socket, appPrefix: string): void {
        this.io = io;
        this.appPrefix = appPrefix;
        socket.on(
            SpotifyRequest.fetchSearchCommandHook(appPrefix, SpotifyService.SERVICE_PREFIX),
            (spotifyRequest: SpotifyRequest): any => {
                spotifyRequest = SpotifyRequest.FromObject(spotifyRequest);
                switch (spotifyRequest.GetType()) {
                    case SpotifyRequest.SEARCH:
                        this.handle_search(spotifyRequest.GetValue());
                        break;
                    default:
                }
            });
    }

    private handle_search(searchRequest: SpotifySearchRequest): void {
        searchRequest = SpotifySearchRequest.FromObject(searchRequest);

        let searchObject: any;
        switch (searchRequest.GetType()) {
            case SpotifySearchRequest.ST_ALBUM:
                searchObject = this.spotify.searchAlbums(searchRequest.GetSearchValue());
                break;
            case SpotifySearchRequest.ST_ARTIST:
                searchObject = this.spotify.searchArtists(searchRequest.GetSearchValue());
                break;
            case SpotifySearchRequest.ST_SONG:
            default:
                searchObject = this.spotify.searchTracks(searchRequest.GetSearchValue());
        }

        searchObject.then((data) => {
            let searchData: SpotifySearchResponseData = new SpotifySearchResponseData().loadFromData(data);
            this.io.emit(
                SpotifySearchResponse.fetchSearchResponseHook(this.appPrefix, SpotifyService.SERVICE_PREFIX),
                new SpotifySearchResponse(
                    searchRequest.GetType(),
                    searchData.GetItems(),
                    searchData.GetLimit(),
                    searchData.GetTotal(),
                    searchData.GetOffset()
                )
            );
        }, (err) => {
            if (err.statusCode == 401) {
                this.setup_key();
                this.handle_search(searchRequest);
            }
        });
    }
}