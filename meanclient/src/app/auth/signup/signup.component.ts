import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthData } from '../auth-data.model';
import { AuthService } from '../auth.service';

@Component({ templateUrl: './signup.component.html', styleUrls: ['./signup.component.scss'] })
export class SignupComponent implements OnInit {
  isLoading = false;
  signupForm: FormGroup;

  constructor(private fb: FormBuilder, private authService: AuthService) { }

  ngOnInit() {
    this.signupForm = this
      .fb
      .group({
        email: [
          '',
          [Validators.required, Validators.email]
        ],
        password: [
          '',
          [Validators.required]
        ]
      });
  }

  onSubmit() {
    if (!this.signupForm.valid) {
      return;
    }
    const authData: AuthData = { ...this.signupForm.value };
    this.isLoading = true;
    this.authService.createUser(authData)
      .subscribe(res => {
        this.isLoading = false;

        console.log(res);
      }, err => {
        this.isLoading = false;
        console.log(err);

      });
  }
}
