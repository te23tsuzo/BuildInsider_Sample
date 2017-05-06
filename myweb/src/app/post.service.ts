import {Injectable} from '@angular/core';
import {Http, Response} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import {Post} from './model_post';

declare var process: any;

@Injectable()
export class PostService {
  posts: Post[];
  //private postsUrl = 'http://localhost:8080/posts/' + encodeURI('ラーメン');
  private postsUrl = process.env.POST_URL + encodeURI('ラーメン');

  constructor(private http: Http) {};

  getPosts(): Observable<Post[]> {
    console.log(this.postsUrl);
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
