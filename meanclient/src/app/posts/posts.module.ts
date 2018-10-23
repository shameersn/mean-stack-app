import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { AppMaterialModule } from '../app-material.module';

import { PostCreateComponent } from './post-create/post-create.component';
import { PostListComponent } from './post-list/post-list.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AppMaterialModule
  ],
  declarations: [
    PostListComponent,
    PostCreateComponent,
  ]
})
export class PostsModule {

}
