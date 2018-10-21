import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthData } from '../auth-data.model';
import { AuthService } from '../auth.service';

@Component({ templateUrl: './login.component.html', styleUrls: ['./login.component.scss'] })
export class LoginComponent implements OnInit {
  isLoading = false;
  loginForm: FormGroup;

  constructor(private fb: FormBuilder, private authService: AuthService) { }

  ngOnInit() {
    this.loginForm = this
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
    if (!this.loginForm.valid) {
      return;
    }
    this.isLoading = true;
    const authData: AuthData = { ...this.loginForm.value };
    this.authService.login(authData);

  }
}
