import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {PostsComponent} from './posts';
import {PostsList} from './PostsList';
import {PostDetail} from './PostDetail';

@NgModule({
  imports: [
    BrowserModule
  ],
  declarations: [
    PostsComponent,
    PostsList,
    PostDetail
  ],
  bootstrap: [PostsComponent]
})
export class AppModule {}
