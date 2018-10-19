import { Component, OnInit, OnDestroy } from '@angular/core';
import { PostsService } from '../posts.service';
import { Subscription } from 'rxjs';
import { Post } from '../posts.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.scss']
})
export class PostListComponent implements OnInit, OnDestroy {
  private postSub: Subscription;
  posts: Post[] = [];
  isLoading = false;

  constructor(private postsService: PostsService, private router: Router) {
  }

  ngOnInit() {
      this.isLoading = true;
    this.postSub = this.postsService.onPostAdded.subscribe((posts: Post[]) => {
      this.posts = posts;
      this.isLoading = false;

    });

    this.postsService.getPosts();
  }

  ngOnDestroy() {
    this.postSub.unsubscribe();
  }

  onDelete(postId) {
    this.postsService.delete(postId)
      .subscribe(res => {
        console.log(res);
        this.postsService.getPosts();
    });
  }

  onEdit(postId) {
    this.router.navigate(['edit', postId]);
  }
}
