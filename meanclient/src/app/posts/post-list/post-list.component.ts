import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { PageEvent } from '@angular/material/paginator';
import { Router } from '@angular/router';

import { Post } from '../posts.model';
import { PostsService } from '../posts.service';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.scss']
})
export class PostListComponent implements OnInit, OnDestroy {
  private postSub: Subscription;
  posts: Post[] = [];
  isLoading = false;
  totalPosts = 0;
  size = 2;
  page = 1;
  pageSizeOptions = [1, 2, 5, 10];
  isAuthenticated = false;
  userId: string;
  private isAuthSub: Subscription;

    constructor(private postsService: PostsService, private router: Router, private authService: AuthService ) {}

  ngOnInit() {
    this.isLoading = true;
    this.postSub = this.postsService.onPostAdded.subscribe((res: { posts: Post[]; postsCount: number }) => {
      this.totalPosts = res.postsCount;
      this.posts = res.posts;
      this.isLoading = false;
    });

    this.postsService.getPosts({ size: this.size, page: this.page });

    this.isAuthSub = this.authService.isUserAuthenticated().subscribe(authStatus => {
      this.isAuthenticated = authStatus;
    });

    this.isAuthenticated = this.authService.getAuthStatus();
    this.userId = this.authService.getUserId();
  }

  ngOnDestroy() {
    this.postSub.unsubscribe();
    this.isAuthSub.unsubscribe();
  }

  onDelete(postId) {
    this.postsService.delete(postId).subscribe(res => {
      this.isLoading = true;
      this.page = 1;
      this.postsService.getPosts({ size: this.size, page: this.page });
    }, err => {
      this.isLoading = false;
    });
  }

  onEdit(postId) {
    this.router.navigate(['edit', postId]);
  }

  pageChangeEvent(pageData: PageEvent) {
    this.size = pageData.pageSize;
    this.page = pageData.pageIndex + 1;
    this.isLoading = true;
    this.postsService.getPosts({ size: this.size, page: this.page });
  }
}
