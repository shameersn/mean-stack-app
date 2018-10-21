import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  isAuthenticated = false;
  private isAuthenticatedSubs: Subscription;
  constructor(private authService: AuthService) {
  }

  ngOnInit() {
    this.isAuthenticated = this.authService.getAuthStatus();
    this.isAuthenticatedSubs = this.authService.isUserAuthenticated().subscribe(authStatus => {
      this.isAuthenticated = authStatus;
    });
  }

  ngOnDestroy() {
    this.isAuthenticatedSubs.unsubscribe();
  }

  onLogout() {
    this.authService.logOut();
  }
}
