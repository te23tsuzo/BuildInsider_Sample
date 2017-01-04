import {Component, ViewEncapsulation, OnInit} from '@angular/core';
import {Post} from './model_post';
import {PostService} from './post.service';

@Component({
  selector: 'fountain-app',
  template: require('./posts.html'),
  encapsulation: ViewEncapsulation.None,
  providers: [PostService]
})
export class PostsComponent implements OnInit {
  public posts: Post[];
  public selectedPost: Post;
  errorMessage: string;

  constructor(private postService: PostService) {
  }

  getPosts(): void {
    this.postService.getPosts()
      .subscribe(
        data => this.posts = data,
        error => this.errorMessage = error);
  }

  ngOnInit(): void {
    this.getPosts();
  }

  onSelect(post: Post): void {
    this.selectedPost = post;
  }
}
