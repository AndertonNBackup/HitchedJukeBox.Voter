import { Component, OnInit, OnDestroy } from '@angular/core';

import { environment } from '../../environments/environment';

import * as io from 'socket.io-client';
import { Observable } from 'rxjs/Observable';
import { ISubscription } from "rxjs/Subscription";

import { SocketService } from '../core/socket/socket.service';

import { IAlbum } from '../core/models/album';
import { IAlbums } from '../core/models/albums';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit, OnDestroy {

  version: string = environment.version;
  private connection: ISubscription;
  public message: string;
  public albums: IAlbums;

  constructor(private socket: SocketService) { }

  ngOnInit() {
    this.connection = this.socket.getMessages().subscribe(serverResponse => {
      //this.messages.push(message);
      console.log("Service response recieved.");
      let serverResponseString = JSON.stringify(serverResponse);
      this.albums = JSON.parse(serverResponseString);
      console.log(this.albums);
    })
  }

  test() {
    let request = {
      type: '',
      search: this.message
    };
    this.socket.sendMessage(request);
    this.message = '';
  }

  ngOnDestroy() {
    this.connection.unsubscribe();
  }
}
