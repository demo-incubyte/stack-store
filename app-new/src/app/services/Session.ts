```typescript
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { EventEmitter } from '@angular/core';

export const AUTH_EVENTS = {
  loginSuccess: 'auth-login-success',
  loginFailed: 'auth-login-failed',
  logoutSuccess: 'auth-logout-success',
  sessionTimeout: 'auth-session-timeout',
  notAuthenticated: 'auth-not-authenticated',
  notAuthorized: 'auth-not-authorized'
};

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private onAuthEventEmitter = new EventEmitter<string>();

  constructor(private http: HttpClient) {}

  isAuthenticated(): boolean {
    return !!Session.user;
  }

  getLoggedInUser(fromServer: boolean): Observable<any> {
    if (this.isAuthenticated() && !fromServer) {
      return Observable.of(Session.user);
    }
    return this.http.get('/session').pipe(
      map(onSuccessfulLogin),
      catchError(() => Observable.of(null))
    );
  }

  signup(credentials: any): Observable<any> {
    return this.http.post('/signup', credentials).pipe(
      map(onSuccessfulLogin),
      catchError(() => {
        console.log("I CAUGHT THE POST REQUEST ERROR");
        return throwError({ message: 'Invalid signup credentials.' });
      })
    );
  }

  login(credentials: any): Observable<any> {
    return this.http.post('/login', credentials).pipe(
      map(response => {
        onSuccessfulLogin(response);
      }),
      catchError(() => {
        console.log("THIS MESSAGE IS FROM AUTHSERVICE");
        return throwError({ message: 'Invalid login credentials.' });
      })
    );
  }

  logout(): Observable<any> {
    return this.http.get('/logout').pipe(
      map(() => {
        Session.destroy();
        this.onAuthEventEmitter.emit(AUTH_EVENTS.logoutSuccess);
      })
    );
  }

  onAuthEvent(): Observable<string> {
    return this.onAuthEventEmitter.asObservable();
  }
}

export class Session {
  static id: any = null;
  static user: any = null;

  static create(sessionId: any, user: any): void {
    Session.id = sessionId;
    Session.user = user;
  }

  static destroy(): void {
    Session.id = null;
    Session.user = null;
  }
}

@Injectable({
  providedIn: 'root'
})
export class AuthInterceptor {
  constructor(private authService: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status in statusDict) {
          this.authService.onAuthEventEmitter.emit(statusDict[error.status]);
        }
        return throwError(error);
      })
    );
  }
}

export const statusDict: { [key: number]: string } = {
  401: AUTH_EVENTS.notAuthenticated,
  403: AUTH_EVENTS.notAuthorized,
  419: AUTH_EVENTS.sessionTimeout,
  440: AUTH_EVENTS.sessionTimeout
};

export function onSuccessfulLogin(response: any): any {
  const data = response.data;
  Session.create(data.id, data.user);
  this.authService.onAuthEventEmitter.emit(AUTH_EVENTS.loginSuccess);
  return data.user;
}

export function authInterceptorProvider() {
  return {
    provide: HTTP_INTERCEPTORS,
    useClass: AuthInterceptor,
    multi: true
  };
}
```