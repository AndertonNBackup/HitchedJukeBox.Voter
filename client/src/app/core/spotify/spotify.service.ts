import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { SocketService } from '../socket/socket.service'

import { SpotifyRequest } from '../models/spotify-request';

@Injectable()
export class SpotifyService {

    servicePrefix: string = 'HJBV_';
    searchCommand: string = "Search";
    searchHook: string = "SpotifySearchResponse";

    constructor(private socket: SocketService) {

    }

    search(spotifyRequest: SpotifyRequest) {
        let searchCmd = this.servicePrefix + this.searchCommand;
        this.socket.sendMessage('test_hook', spotifyRequest);
    }

    listen(): Observable<any> {
        return this.socket.getMessages(this.servicePrefix + this.searchHook);
    };

}