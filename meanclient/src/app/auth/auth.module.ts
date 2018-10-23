import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { AppMaterialModule } from '../app-material.module';

import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { AuthRoutingModule } from './auth-routing.module';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AppMaterialModule,
    AuthRoutingModule
  ],
  declarations: [
    LoginComponent, SignupComponent
  ]
})
export class AuthModule {

}
