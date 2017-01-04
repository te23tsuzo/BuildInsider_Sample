import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {HttpModule} from '@angular/http';

import {PostsComponent} from './posts';
import {Postdetail} from './postdetail';
import {PostService} from './post.service';

@NgModule({
  imports: [
    BrowserModule,
    HttpModule
  ],
  declarations: [
    PostsComponent,
    Postdetail
  ],
  providers: [PostService],
  bootstrap: [PostsComponent]
})
export class AppModule {}
