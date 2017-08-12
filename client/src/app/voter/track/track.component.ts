import { Component, OnInit, Input } from '@angular/core';

@Component({
    selector: 'app-track',
    templateUrl: './track.component.html',
    styleUrls: ['../../about/about.component.scss']
})
export class TrackComponent implements OnInit {

    @Input()
    track: Object;

    constructor() { }

    ngOnInit() {

    }

}