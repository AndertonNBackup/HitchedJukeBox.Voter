import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { SocketService } from '../socket/socket.service'

@Injectable()
export class SearchService {

    servicePrefix: string = 'HJBV_';
    searchCommand: string = "Search";
    searchHook: string = "SearchResponse";

    constructor(private socket: SocketService) {

    }

    search(searchObject: object) {
        let searchCmd = this.servicePrefix + this.searchCommand;
        this.socket.sendMessage(searchCmd, searchObject);
    }

    listen(): Observable<any> {
        return this.socket.getMessages(this.servicePrefix + this.searchHook);
    };

}