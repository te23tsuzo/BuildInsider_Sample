import {Component} from '@angular/core';

@Component({
  selector: 'postslist',
  template: require('./PostsList.html')
})
export class PostsList {
  public text: string;

  constructor() {
    this.text = 'My Post list!';
  }
}
