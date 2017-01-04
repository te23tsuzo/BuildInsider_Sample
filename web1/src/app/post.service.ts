import {Injectable} from '@angular/core';
import {Http, Response} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import {Post} from './model_post';

@Injectable()
export class PostService {
  posts: Post[];
  private postsUrl = 'http://localhost:8080/posts/ramen';

  constructor(private http: Http) {};

  getPosts(): Observable<Post[]> {
    console.log(this.postsUrl);
    // this.posts =[
    //   {id: "1", title: "test1", contents: "test contents1", tags: ["test"], date: "2016/12/12"},
    //   {id: "2", title: "test2", contents: "test contents2", tags: ["test"], date: "2016/12/13"}
    // ];
    return this.http.get(this.postsUrl)
      .map(this.extractData)
      .catch(this.handleError);
  }

  extractData(res: Response) {
    let body = res.json();
    console.log(body);
    return body || {};
  }

  handleError(error: Response | any) {
    console.error('error occured', error);
    let errMsg: string;
    if (error instanceof Response) {
        const body = error.json() || '';
        const err = body.error || JSON.stringify(error);
        errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
    } else {
      errMsg = error.message ? error.message : error.toString();
    }

    return Observable.throw(errMsg);
  }
}
