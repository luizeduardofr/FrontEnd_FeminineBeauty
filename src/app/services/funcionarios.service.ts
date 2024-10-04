import { Injectable } from '@angular/core';
import { Funcionario } from '../models/funcionario';
import { HttpClient } from '@angular/common/http';
import { PageableResponse } from '../models/pageableResponse';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FuncionariosService {
  private apiUrl = 'http://localhost:8080/funcionarios';

  constructor(private http: HttpClient) {}

  getFuncionarios(): Observable<PageableResponse<Funcionario>> {
    return this.http.get<PageableResponse<Funcionario>>(`${this.apiUrl}`);
  }

  addFuncionario(funcionario: Funcionario): Observable<Funcionario> {
    return this.http.post<Funcionario>(`${this.apiUrl}`, funcionario);
  }

  updateFuncionario(funcionario: Funcionario): Observable<Funcionario> {
    return this.http.put<Funcionario>(`${this.apiUrl}`, funcionario);
  }

  deleteFuncionario(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
