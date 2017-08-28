import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { ISubscription } from "rxjs/Subscription";

import { environment } from '../../../../../environments/environment';

import { AuthenticationService, Credentials } from '../../../../core/authentication/authentication.service';

import { NowPlayingItem } from '../../../../core/models/shared/now-playing/now-playing-item';

import { NowPlayingRequest } from '../../../../core/models/shared/now-playing/now-playing-request';
import { NowPlayingCommandRequest } from '../../../../core/models/shared/now-playing/now-playing-command-request';

import { NowPlayingService } from '../../../../core/now-playing/now-playing.service';
import { NowPlayingResponse } from '../../../../core/models/shared/now-playing/now-playing-response';
import { QueueManagerService } from '../../../../core/queue-manager/queue-manager.service';
import { QueueManagerResponse } from '../../../../core/models/shared/queue-manager/queue-manager-response';

@Component({
    selector: 'hjbv-now-playing',
    templateUrl: './now-playing.component.html',
    styleUrls: ['./now-playing.component.scss']
})
export class NowPlayingComponent implements OnInit {

    private PlayList: Array<any>;
    private Playing: NowPlayingItem;
    private connection: ISubscription;
    private playerConnection: ISubscription;

    private authentication: AuthenticationService;
    private credentials: Credentials;

    private timerHandle: any;
    private timerCurrent: number;

    constructor(private nowPlayingService: NowPlayingService, private queueManagerService: QueueManagerService, authentication: AuthenticationService) {
        this.PlayList = new Array<NowPlayingItem>();
        this.authentication = authentication;
        this.credentials = this.authentication.credentials;
    }

    ngOnInit() {

        let responseHook: string = NowPlayingResponse.fetchNowPlayingResponseHook(NowPlayingService.appPrefix, NowPlayingService.servicePrefix);
        this.connection = this.nowPlayingService.listen(responseHook).subscribe(npResult => {
            this.PlayList = NowPlayingResponse.FromObject(npResult).queue;
        });

        let npItem: NowPlayingItem;
        let playerResponseHook: string = QueueManagerResponse.fetchQueueManagerResponseHook(QueueManagerService.appPrefix, QueueManagerService.servicePrefix);
        this.connection = this.queueManagerService.listen(playerResponseHook).subscribe(qmResult => {

            clearTimeout(this.timerHandle);
            let ProgressCount: number = 0;
            let npItem = QueueManagerResponse.FromObject(qmResult).item;
            npItem = NowPlayingItem.FromObject(npItem);
            this.Playing = NowPlayingItem.FromObject(npItem);
            console.log(this.Playing);

            this.timerHandle = setInterval(() => {
                this.timerCurrent = ((ProgressCount + 1) / npItem.GetPlaytime()) * 100;
                ProgressCount++;
                if((this.timerCurrent >= 100) || ProgressCount >=  npItem.GetPlaytime()) {
                  clearTimeout(this.timerHandle);
                }
              }, 1000);

        });

        let commandRequest = new NowPlayingCommandRequest(NowPlayingCommandRequest.NPC_REFRESH);
        let nowPlayingRequest = new NowPlayingRequest(NowPlayingRequest.NP_REQUEST_COMMAND, commandRequest);
        this.nowPlayingService.talk(nowPlayingRequest);

    }

    clear() {

        let commandRequest = new NowPlayingCommandRequest(NowPlayingCommandRequest.NPC_CLEAR);
        let nowPlayingRequest = new NowPlayingRequest(NowPlayingRequest.NP_REQUEST_COMMAND, commandRequest);
        this.nowPlayingService.talk(nowPlayingRequest);

    }

}
