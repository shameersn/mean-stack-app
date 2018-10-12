import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Post } from '../posts.model';
import { PostsService } from '../posts.service';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.scss']
})
export class PostCreateComponent {
 constructor(private postService: PostsService) {

 }

 onAddPost(postForm: NgForm) {
   if (postForm.invalid) {
     return ;
   }
   const inputPost: Post = {
     ...postForm.value
   };
   postForm.resetForm();
   this.postService.addPost(inputPost);
 }
}
