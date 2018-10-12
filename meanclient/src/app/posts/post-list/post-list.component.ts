import { Component, OnInit, OnDestroy } from '@angular/core';
import { PostsService } from '../posts.service';
import { Subscription } from 'rxjs';
import { Post } from '../posts.model';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.scss']
})
export class PostListComponent implements OnInit, OnDestroy {
  private postSub: Subscription;
  posts: Post[] = [];

  constructor(private postsService: PostsService) {
  }

  ngOnInit() {
    this.postSub = this.postsService.onPostAdded.subscribe((posts: Post[]) => {
      this.posts = posts;
    });

    this.postsService.getPosts();
  }

  ngOnDestroy() {
    this.postSub.unsubscribe();
  }

}
