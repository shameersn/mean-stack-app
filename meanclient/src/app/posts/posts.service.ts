import { Injectable } from '@angular/core';
import { Post } from './posts.model';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class PostsService {
  private  posts: Post[] = [];
  public onPostAdded: Subject<Post[]> = new Subject();

  constructor(private http: HttpClient) {}

  addPost(post: Post) {
    this.posts.push(post);
    this.onPostAdded.next([...this.posts]);
  }

  getPosts() {
    this.http.get<{message: string, posts: Post[]}>('http://localhost:3000/posts')
      .subscribe(res => {
        this.posts = res.posts;

        this.onPostAdded.next([...this.posts]);
      });
  }
}

