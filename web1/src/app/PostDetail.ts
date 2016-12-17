import {Component} from '@angular/core';
import {Post} from './model_post';

@Component({
  selector: 'postdetail',
  template: require('./PostDetail.html')
})
export class PostDetail {
  public post:Post;

  constructor() {
  }
}
