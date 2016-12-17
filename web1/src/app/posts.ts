import {Component} from '@angular/core';

@Component({
  selector: 'fountain-app',
  template: require('./posts.html')
})
export class PostsComponent {
  public hello: string;

  constructor() {
    this.hello = 'Hello Posts!';
  }
}
