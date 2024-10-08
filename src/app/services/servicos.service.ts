import { Injectable } from '@angular/core';
import { Servico } from '../models/servico';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PageableResponse } from '../models/pageableResponse';
import { Funcionario } from '../models/funcionario';

@Injectable({
  providedIn: 'root',
})
export class ServicosService {
  private apiUrl = 'http://localhost:8080/servicos';

  constructor(private http: HttpClient) {}

  getServicos(
    page: number,
    size: number
  ): Observable<PageableResponse<Servico>> {
    let params = new HttpParams().set('page', page).set('size', size);
    return this.http.get<PageableResponse<Servico>>(`${this.apiUrl}`, {
      params,
    });
  }

  getServicosByFuncionario(funcionario: Funcionario): Observable<Servico[]> {
    return this.http.get<Servico[]>(
      `${this.apiUrl}/funcionario/${funcionario.id}`
    );
  }

  addServico(servico: Servico): Observable<Servico> {
    return this.http.post<Servico>(`${this.apiUrl}`, servico);
  }

  updateServico(servico: Servico): Observable<Servico> {
    return this.http.put<Servico>(`${this.apiUrl}`, servico);
  }

  deleteServico(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

}
