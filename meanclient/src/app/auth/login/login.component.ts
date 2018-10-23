import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthData } from '../auth-data.model';
import { AuthService } from '../auth.service';
import { Subscription } from 'rxjs';

@Component({ templateUrl: './login.component.html', styleUrls: ['./login.component.scss'] })
export class LoginComponent implements OnInit, OnDestroy {
  isLoading = false;
  loginForm: FormGroup;
  private authSubs: Subscription;

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

    this.authSubs = this.authService.isUserAuthenticated()
      .subscribe(authStatus => {
        this.isLoading = false;
      });
  }

  ngOnDestroy() {
    this.authSubs.unsubscribe();
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
