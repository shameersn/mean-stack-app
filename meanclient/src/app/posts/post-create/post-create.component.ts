import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Post } from '../posts.model';
import { PostsService } from '../posts.service';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { MimeTypeValidator } from './mime-type.validator';


@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.scss']
})
export class PostCreateComponent implements OnInit {
  constructor(
    private postService: PostsService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {}
  private postId = '';
  private isEdit = false;
  post: Post;
  isLoading = false;
  postAddForm: FormGroup;
  imagePreview: string;

  ngOnInit() {
    this.postAddForm = new FormGroup({
      title: new FormControl(null, [
        Validators.required,
        Validators.minLength(3)
      ]),
      content: new FormControl(null, [Validators.required]),
      image: new FormControl(null, {
        // validators: [Validators.required],
        // asyncValidators: [MimeTypeValidator]
      })
    });

    this.activatedRoute.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('postId')) {
        this.postId = paramMap.get('postId');
        this.isEdit = true;
        this.isLoading = true;
        this.postService.getPost(this.postId).subscribe(postData => {
          this.post = {
            id: postData.data._id,
            title: postData.data.title,
            content: postData.data.content,
            imagePath: postData.data.imagePath
          };
          this.isLoading = false;
          this.postAddForm.setValue({
            title: postData.data.title,
            content: postData.data.title,
            image: postData.data.imagePath
          });
        });
      }
    });
  }


  onAddPost() {
    if (this.postAddForm.invalid) {
      return;
    }
    const inputPost = {
      ...this.postAddForm.value
    };
    this.isLoading = true;

    if (this.isEdit) {
      this.postService.updatePost(
        this.postId,
        inputPost.title,
        inputPost.content,
        inputPost.image
      ).subscribe(res => {
        this.postAddForm.reset();
        this.router.navigate(['/']);
      }, err => {
        this.postAddForm.reset();
        this.isLoading = false;
      });
    } else {
      this.postService.addPost(
        inputPost.title,
        inputPost.content,
        inputPost.image
      ).subscribe((res: any) => {
        this.postAddForm.reset();
        this.router.navigate(['/']);
      }, err => {
        this.postAddForm.reset();
        this.isLoading = false;
      });
    }
  }

  onImageSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.postAddForm.patchValue({
      image: file
    });
    this.postAddForm.updateValueAndValidity();
    this.createImagePreview(file);
  }

  createImagePreview(file) {
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }
}
