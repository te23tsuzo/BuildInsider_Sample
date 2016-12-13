import {Component} from '@angular/core';

@Component({
  selector: 'postdetail',
  template: require('./PostDetail.html')
})
export class PostDetail {
  public text: string;

  constructor() {
    this.text = 'My post detail!';
  }
}
