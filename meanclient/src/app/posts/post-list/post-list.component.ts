import { Component, OnInit, OnDestroy } from '@angular/core';
import { PostsService } from '../posts.service';
import { Subscription } from 'rxjs';
import { Post } from '../posts.model';
import { Router } from '@angular/router';
import { PageEvent } from '@angular/material/paginator';

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

  constructor(private postsService: PostsService, private router: Router) {}

  ngOnInit() {
    this.isLoading = true;
    this.postSub = this.postsService.onPostAdded.subscribe((res: { posts: Post[]; postsCount: number }) => {
      this.totalPosts = res.postsCount;
      this.posts = res.posts;
      this.isLoading = false;
    });

    this.postsService.getPosts({ size: this.size, page: this.page });
  }

  ngOnDestroy() {
    this.postSub.unsubscribe();
  }

  onDelete(postId) {
    this.postsService.delete(postId).subscribe(res => {
      this.page = 1;
      this.postsService.getPosts({ size: this.size, page: this.page });
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
