import { Component, OnInit, OnDestroy } from '@angular/core';

import { environment } from '../../environments/environment';

import * as io from 'socket.io-client';
import { Observable } from 'rxjs/Observable';
import { ISubscription } from "rxjs/Subscription";

import { SpotifyService } from '../core/spotify/spotify.service';

import { IAlbum } from '../core/models/album';
import { SpotifyRequest } from '../core/models/spotify-request';
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

  constructor(private spotifyService: SpotifyService ) { 

    this.searchType = this.searchTypes[0];

  }

  ngOnInit() {
    this.connection = this.spotifyService.listen().subscribe(searchResult => {
      this.serverResponse = VoterResponse.fromJSON(searchResult);
      console.log(this.serverResponse);
    });
  }

  test() {
    let searchRequest = new SpotifyRequest(SpotifyRequest.SEARCH, this.message);  
    this.spotifyService.search(searchRequest);
    this.message = '';
  }

  ngOnDestroy() {
    this.connection.unsubscribe();
  }
}
