import { Component, OnInit, OnDestroy } from '@angular/core';

import { environment } from '../../environments/environment';

import * as io from 'socket.io-client';
import { Observable } from 'rxjs/Observable';
import { ISubscription } from "rxjs/Subscription";

import { SearchService } from '../core/search/search.service';

import { IAlbum } from '../core/models/album';
import { IAlbums } from '../core/models/albums';
import { VoterResponse } from '../core/models/voter-response';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit, OnDestroy {

  version: string = environment.version;
  private serverResponse: VoterResponse = new VoterResponse();
  private connection: ISubscription;
  public message: string;

  public searchType: object;
  public searchTypes: Array<object> = [
    {id: 0, name: "Song" },
    {id: 1, name: "Album" },
    {id: 2, name: "Artist" }
  ];

  constructor(private searchService: SearchService ) { 

    this.searchType = this.searchTypes[0];

  }

  ngOnInit() {
    this.connection = this.searchService.listen().subscribe(searchResult => {
      this.serverResponse = VoterResponse.fromJSON(searchResult);
      console.log(this.serverResponse);
    });
  }

  test() {
    let searchRequest = {
      type: this.searchType,
      search: this.message
    };
    this.searchService.search(searchRequest);
    this.message = '';
  }

  ngOnDestroy() {
    this.connection.unsubscribe();
  }
}
