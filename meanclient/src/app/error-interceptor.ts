import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpErrorResponse } from '@angular/common/http';
import {MatSnackBar} from '@angular/material';

import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class  ErrorInterceptor implements HttpInterceptor {
  constructor(public snackBar: MatSnackBar) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage = 'An unknown error occurred!';
        if (error.error.message) {
          errorMessage = error.error.message;
        }
        this.snackBar.open(errorMessage, 'Close', {
          duration: 2000,
          horizontalPosition: 'right',
          verticalPosition: 'top'
        });

        return throwError(error);
      })
    );
  }
}
