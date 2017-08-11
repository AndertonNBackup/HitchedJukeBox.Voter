import { Component, OnInit, Input } from '@angular/core';

@Component({
    selector: 'app-artist',
    templateUrl: './artist.component.html',
    styleUrls: ['../../about/about.component.scss']
})
export class ArtistComponent implements OnInit {

    @Input()
    artist: Object;

    constructor() { }

    ngOnInit() {

    }

}