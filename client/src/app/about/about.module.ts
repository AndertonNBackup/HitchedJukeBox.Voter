import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

import { AboutRoutingModule } from './about-routing.module';
import { AboutComponent } from './about.component';

import { TrackComponent } from '../voter/track/track.component';
import { AlbumComponent } from '../voter/album/album.component';
import { ArtistComponent } from '../voter/artist/artist.component';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    FormsModule,
    AboutRoutingModule
  ],
  declarations: [
    AboutComponent,
    TrackComponent,
    AlbumComponent,
    ArtistComponent
  ]
})
export class AboutModule { }
