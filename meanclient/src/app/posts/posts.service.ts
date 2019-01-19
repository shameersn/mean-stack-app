import { Injectable } from '@angular/core';
import { Post } from './posts.model';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

@Injectable({providedIn: 'root'})
export class PostsService {
  private posts: Post[] = [];
  public onPostAdded: Subject<{ posts: Post[]; postsCount: number }> = new Subject();

  constructor(private http: HttpClient, private router: Router) {}
  private url = `${environment.apiUrl}posts`;

  addPost(title: string, content: string, image: File) {
   /*  const postData = new FormData();
    postData.append('title', title);
    postData.append('content', content);
    postData.append('image', image, title); */
    const postData = {
      title, content, image
    };
    return this.http.post(this.url, postData);
  }

  getPosts(queryParams) {
    this.http
      .get<{ message: string; data: { posts: any[]; postsCount: number } }>(this.url, { params: queryParams })
      .pipe(
        map(resData => {
          return {
            posts: resData.data.posts.map(item => {
              return {
                id: item._id,
                title: item.title,
                content: item.content,
                imagePath: item.imagePath,
                creator: item.creator
              };
            }),
            postsCount: resData.data.postsCount
          };
        })
      )
      .subscribe(resPosts => {
        this.posts = resPosts.posts;
        this.onPostAdded.next({ posts: [...this.posts], postsCount: resPosts.postsCount });
      });
  }

  delete(postId) {
    return this.http.delete(this.url + '/' + postId);
  }

  getPost(postId: string) {
    // return { ...this.posts.find(item => item.id === postId) };
    return this.http.get<{
      message: string;
      data: { _id: string; title: string; content: string; imagePath: string };
    }>(this.url + '/' + postId);
  }

  updatePost(id: string, title: string, content: string, imagePath: string | File) {
    let post: Post | FormData;
    if (typeof imagePath === 'object') {
      post = new FormData();
      post.append('id', id);
      post.append('title', title);
      post.append('content', content);
      post.append('image', imagePath, title);
    } else {
      post = {
        id,
        title,
        content,
        imagePath
      };
    }
    return this.http.put(this.url + '/' + id, post);
  }
}
