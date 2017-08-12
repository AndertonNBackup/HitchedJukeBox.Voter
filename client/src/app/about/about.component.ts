import { Component, OnInit, OnDestroy } from '@angular/core';

import { environment } from '../../environments/environment';

import * as io from 'socket.io-client';
import { Observable } from 'rxjs/Observable';
import { ISubscription } from "rxjs/Subscription";

import { SpotifyService } from '../core/spotify/spotify.service';

import { IAlbum } from '../core/models/album';
import { SpotifyRequest } from '../core/models/shared/spotify/spotify-request';
import { SpotifySearchRequest } from '../core/models/shared/spotify/spotify-search-request';
import { SpotifySearchResponse } from '../core/models/shared/spotify/spotify-search-response';
import { VoterResponse } from '../core/models/voter-response';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit, OnDestroy {

  version: string = environment.version;
  private serverResponse: SpotifySearchResponse;
  private connection: ISubscription;
  public message: string;

  public searchType: {id: number; name: string};
  public searchTypes: Array<any> = [
    {id: 0, name: "Song" },
    {id: 1, name: "Album" },
    {id: 2, name: "Artist" }
  ];

  constructor(private spotifyService: SpotifyService ) { 

    this.searchType = this.searchTypes[0];

  }

  ngOnInit() {
    this.connection = this.spotifyService.listen().subscribe(searchResult => {
      this.serverResponse = SpotifySearchResponse.FromObject(searchResult);
      console.log(this.serverResponse);
    });
  }

  test() {
    let searchRequest = new SpotifySearchRequest(this.searchType, this.message);
    let spotifyRequest = new SpotifyRequest(SpotifyRequest.SEARCH, searchRequest);  
    this.spotifyService.search(spotifyRequest);
    this.message = '';
  }

  ngOnDestroy() {
    this.connection.unsubscribe();
  }
}
