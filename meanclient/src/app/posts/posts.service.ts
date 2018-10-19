import { Injectable } from '@angular/core';
import { Post } from './posts.model';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable()
export class PostsService {
  private posts: Post[] = [];
  public onPostAdded: Subject<Post[]> = new Subject();

  constructor(private http: HttpClient, private router: Router) { }
  private url = 'http://localhost:3000/posts';

  addPost(newPost: Post) {
    this.http.post(this.url, { ...newPost })
      .subscribe((res: any) => {
        newPost.id = res.data._id;
        this.posts.push(newPost);
        this.onPostAdded.next([...this.posts]);
        this.router.navigate(['/']);
      });
  }

  getPosts() {
    this.http.get<{ message: string, posts: any[] }>(this.url)
      .pipe(map((resData) => {
        return resData.posts.map(item => {
          return {
            id: item._id,
            title: item.title,
            content: item.content
          };
        });
      }))
      .subscribe(resPosts => {
        this.posts = resPosts;
        this.onPostAdded.next([...this.posts]);
      });
  }

  delete(postId) {
    return this.http.delete(this.url + '/' + postId);
  }

  getPost(postId: string) {
    // return { ...this.posts.find(item => item.id === postId) };
    return this.http.get<{ message: string, data: { _id: string, title: string, content: string } }>(this.url + '/' + postId);
  }

  updatePost(id: string, title: string, content: string) {
    const updatedPost: Post = {
      id,
      title,
      content
    };

    this.http.put(this.url + '/' + id, updatedPost)
      .subscribe(res => {
        console.log(res);
        this.router.navigate(['/']);
      });
  }
}

