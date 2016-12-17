import {Component, Input} from '@angular/core';
import {Post} from './model_post';

@Component({
  selector: 'postdetail',
  template: require('./postdetail.html')
})
export class Postdetail {
  @Input()
  post: Post;

}
