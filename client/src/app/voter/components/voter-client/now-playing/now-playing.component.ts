import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { ISubscription } from "rxjs/Subscription";

import { environment } from '../../../../../environments/environment';

import { NowPlayingItem } from '../../../../core/models/shared/now-playing/now-playing-item';

import { NowPlayingService } from '../../../../core/now-playing/now-playing.service';
import { NowPlayingResponse } from '../../../../core/models/shared/now-playing/now-playing-response';

@Component({
    selector: 'hjbv-now-playing',
    templateUrl: './now-playing.component.html',
    styleUrls: ['./now-playing.component.scss']
})
export class NowPlayingComponent implements OnInit {

    private PlayList: Array<any>;
    private connection: ISubscription;

    constructor(private nowPlayingService: NowPlayingService) {
        this.PlayList = new Array<NowPlayingItem>();
    }

    ngOnInit() {

        let responseHook: string = NowPlayingResponse.fetchNowPlayingResponseHook(NowPlayingService.appPrefix, NowPlayingService.servicePrefix);
        this.connection = this.nowPlayingService.listen(responseHook).subscribe(npResult => {
            this.PlayList = NowPlayingResponse.FromObject(npResult).queue;
            console.log(this.PlayList);
        });

    }

    clear() {

        this.PlayList = new Array<any>();

    }

}
