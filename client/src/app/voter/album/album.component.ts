import { Component, OnInit, Input } from '@angular/core';

@Component({
    selector: 'app-album',
    templateUrl: './album.component.html',
    styleUrls: ['../../about/about.component.scss']
})
export class AlbumComponent implements OnInit {

    @Input()
    album: Object;

    constructor() { }

    ngOnInit() {

    }

}