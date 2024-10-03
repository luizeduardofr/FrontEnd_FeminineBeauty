import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'http://localhost:8080/auth';

  constructor(private http: HttpClient, private router: Router) {}

  login(login: string, senha: string): Observable<any> {
    return this.http.post<{ token: string }>(`${this.apiUrl}/login`, { login, senha });
  }

  handleLogin(token: string): void {
    localStorage.setItem('token', token);
    this.router.navigate(['/dashboard']);
  }

  logout(): void {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  private isTokenExpired(token: string): boolean {
    const payload = this.parseJwt(token);
    const expiration = payload?.exp ? payload.exp * 1000 : 0;
    return Date.now() >= expiration;
  }

  private parseJwt(token: string): any {
    const base64Url = token.split('.')[1];
    
    try {
      const base64 = decodeURIComponent(atob(base64Url).replace(/\\+/g, ''));
      return JSON.parse(base64);
    } catch (error) {
      this.logout();
    }
    
  }

  checkAuth(): boolean {
    const token = this.getToken();
    return !!token && !this.isTokenExpired(token);
  }

}
