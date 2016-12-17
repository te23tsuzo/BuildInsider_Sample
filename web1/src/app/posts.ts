import {Component} from '@angular/core';
import {Post} from './model_post';

@Component({
  selector: 'fountain-app',
  template: require('./posts.html')
})
export class PostsComponent {
  public posts: Post[];
  public selectedPost: Post;

  constructor() {
    this.posts = [
      {id: "test1", title: "Title1", contents: "This test contens.", tags: ["test","sample"], date: "2016/12/17"},
      {id: "test2", title: "Title2", contents: "This test contens2.", tags: ["test","sample"], date: "2016/12/17"}
    ];
  }

  onSelect(post: Post) {
    this.selectedPost = post;
  }
}
