import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {PostsComponent} from './posts';
import {PostDetail} from './PostDetail';

@NgModule({
  imports: [
    BrowserModule
  ],
  declarations: [
    PostsComponent,
    PostDetail
  ],
  bootstrap: [PostsComponent]
})
export class AppModule {}
