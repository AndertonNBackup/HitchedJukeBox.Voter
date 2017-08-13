import { Component, OnInit, Input } from '@angular/core';

import { SpotifyAlbum } from '../../core/models/shared/core/spotify-album'

@Component({
    selector: 'app-album',
    templateUrl: './album.component.html',
    styleUrls: ['../../about/about.component.scss']
})
export class AlbumComponent implements OnInit {

    @Input()
    album: SpotifyAlbum;

    constructor() { }

    ngOnInit() {
        this.album = new SpotifyAlbum(this.album);
        console.log(this.album.GetName());
    }

}