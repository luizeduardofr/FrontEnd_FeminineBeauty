import { Injectable } from '@angular/core';
import { Agendamento } from '../models/agendamento';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PageableResponse } from '../models/pageableResponse';

@Injectable({
  providedIn: 'root',
})
export class AgendamentoService {
  private apiUrl = 'http://localhost:8080/consultas';

  constructor(private http: HttpClient) {}

  getAgendamentosCliente(
    page: number,
    size: number,
    idCliente: number
  ): Observable<PageableResponse<Agendamento>> {
    let params = new HttpParams().set('page', page).set('size', size);
    return this.http.get<PageableResponse<Agendamento>>(
      `${this.apiUrl}/cliente/${idCliente}`,
      {
        params,
      }
    );
  }

  addAgendamento(agendamento: Agendamento) {
    return this.http.post<Agendamento>(`${this.apiUrl}`, agendamento);
  }

  getOldAgendamentosCliente(
    page: number,
    size: number,
    idCliente: number
  ): Observable<PageableResponse<Agendamento>> {
    let params = new HttpParams().set('page', page).set('size', size);
    return this.http.get<PageableResponse<Agendamento>>(
      `${this.apiUrl}/old/cliente/${idCliente}`,
      {
        params,
      }
    );
  }

  cancelAgendamento(
    id: number,
    motivoCancelamento: string
  ): Observable<String> {
    return this.http.delete<String>(`${this.apiUrl}`, {
      body: {
        idConsulta: id,
        motivoCancelamento: motivoCancelamento,
      },
    });
  }

  getAgendamentosFuncionario(
    page: number,
    size: number,
    idFuncionario: number
  ): Observable<PageableResponse<Agendamento>> {
    let params = new HttpParams().set('page', page).set('size', size);
    return this.http.get<PageableResponse<Agendamento>>(
      `${this.apiUrl}/funcionario/${idFuncionario}`,
      {
        params,
      }
    );
  }

  getOldAgendamentosFuncionario(
    page: number,
    size: number,
    idFuncionario: number
  ): Observable<PageableResponse<Agendamento>> {
    let params = new HttpParams().set('page', page).set('size', size);
    return this.http.get<PageableResponse<Agendamento>>(
      `${this.apiUrl}/old/funcionario/${idFuncionario}`,
      {
        params,
      }
    );
  }

  concluirAgendamento(id: number): Observable<Agendamento> {
    return this.http.put<Agendamento>(`${this.apiUrl}/concluir`, id);
  }
}
