import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Cliente } from '../models/cliente';
import { UserInfo } from '../models/userInfo';

const rolesPermissions = {
  admin: [
    '/dashboard',
    '/dashboard/servicos',
    '/dashboard/funcionarios',
    '/dashboard/relatorios/agendamentos',
  ],
  funcionario: [
    '/dashboard',
    '/dashboard/perfil',
    '/dashboard/agendamento',
    '/dashboard/relatorios/agendamentos',
  ],
  usuario: [
    '/dashboard',
    '/dashboard/perfil',
    '/dashboard/agendamentos',
    '/dashboard/relatorios/agendamentos',
  ],
};

type Role = keyof typeof rolesPermissions;

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/auth';

  constructor(private http: HttpClient, private router: Router) {}

  login(login: string, senha: string): Observable<any> {
    return this.http.post<{ token: string }>(`${this.apiUrl}/login`, {
      login,
      senha,
    });
  }

  register(cliente: Cliente): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/registro`, cliente);
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

  private isTokenExpired(): boolean {
    const payload = this.parseJwt();
    const expiration = payload?.exp ? payload.exp * 1000 : 0;
    return Date.now() >= expiration;
  }

  private parseJwt(): UserInfo {
    const token = this.getToken() as string;
    const base64Url = token.split('.')[1];

    try {
      const base64 = decodeURIComponent(atob(base64Url).replace(/\\+/g, ''));
      return JSON.parse(base64) as UserInfo;
    } catch (error) {
      this.logout();
      return {} as UserInfo;
    }
  }

  getUserInfo(): UserInfo {
    return this.parseJwt();
  }

  hasPermission = (route: string) => {
    const userInfo = this.getUserInfo();
    const role = userInfo.role as Role;
    return rolesPermissions[role].includes(route);
  };

  checkAuth(): boolean {
    const token = this.getToken();
    if (token != null && this.isTokenExpired()) {
      localStorage.removeItem('token');
      return false;
    }

    return !!token;
  }
}
