import { Injectable } from '@angular/core';
import { Funcionario } from '../models/funcionario';
import { HttpClient, HttpParams } from '@angular/common/http';
import { PageableResponse } from '../models/pageableResponse';
import { Observable } from 'rxjs';
import { Servico } from '../models/servico';

@Injectable({
  providedIn: 'root',
})
export class FuncionariosService {
  private apiUrl = 'http://localhost:8080/funcionarios';

  constructor(private http: HttpClient) {}

  getFuncionario(id: number): Observable<Funcionario> {
    return this.http.get<Funcionario>(`${this.apiUrl}/${id}`);
  }

  getFuncionarios(
    page: number,
    size: number
  ): Observable<PageableResponse<Funcionario>> {
    let params = new HttpParams().set('page', page).set('size', size);
    return this.http.get<PageableResponse<Funcionario>>(`${this.apiUrl}`, {
      params,
    });
  }

  getFuncionariosByServico(servico: Servico): Observable<Funcionario[]> {
    return this.http.get<Funcionario[]>(
      `${this.apiUrl}/servicos/${servico.id}`
    );
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
