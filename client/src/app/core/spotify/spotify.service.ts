import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { SocketService } from '../socket/socket.service'

import { SpotifyRequest } from '../models/shared/spotify/spotify-request';
import { SpotifySearchResponse } from '../models/shared/spotify/spotify-search-response';

@Injectable()
export class SpotifyService {

    appPrefix: string = "HJBV";
    servicePrefix: string = 'Spotify';

    constructor(private socket: SocketService) {

    }

    search(spotifyRequest: SpotifyRequest) {
        let searchHook = SpotifyRequest.fetchSearchCommandHook(this.appPrefix, this.servicePrefix);
        this.socket.sendMessage(searchHook, spotifyRequest);
    }

    listen(): Observable<any> {
        let responseHook = SpotifySearchResponse.fetchSearchResponseHook(this.appPrefix, this.servicePrefix);
        return this.socket.getMessages(responseHook);
    };

}