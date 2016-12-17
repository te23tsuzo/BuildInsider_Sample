import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {PostsComponent} from './posts';
import {Postdetail} from './postdetail';

@NgModule({
  imports: [
    BrowserModule
  ],
  declarations: [
    PostsComponent,
    Postdetail
  ],
  bootstrap: [PostsComponent]
})
export class AppModule {}
