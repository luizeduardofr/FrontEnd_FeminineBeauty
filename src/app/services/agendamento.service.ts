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
    idCliente: number,
    idServico?: number,
    idFuncionario?: number
  ): Observable<PageableResponse<Agendamento>> {
    let params = new HttpParams().set('page', page).set('size', size);
    if (idServico) {
      params = params.set('idServico', idServico);
    }
    if (idFuncionario) {
      params = params.set('idFuncionario', idFuncionario);
    }
    return this.http.get<PageableResponse<Agendamento>>(
      `${this.apiUrl}/cliente/${idCliente}`,
      {
        params,
      }
    );
  }

  addAgendamento(agendamento: Agendamento) {
    return this.http.post<Agendamento>(`${this.apiUrl}`, {
      data: agendamento.data,
      tipoPagamento: agendamento.tipoPagamento,
      funcionario: agendamento.funcionario.id ? agendamento.funcionario : null,
      cliente: agendamento.cliente.id ? agendamento.cliente : null,
      servico: agendamento.servico.id ? agendamento.servico : null,
    });
  }

  getOldAgendamentosCliente(
    page: number,
    size: number,
    idCliente: number,
    idServico?: number,
    idFuncionario?: number,
    status?: string
  ): Observable<PageableResponse<Agendamento>> {
    let params = new HttpParams().set('page', page).set('size', size);
    if (idServico) {
      params = params.set('idServico', idServico);
    }
    if (idFuncionario) {
      params = params.set('idFuncionario', idFuncionario);
    }
    if (status) {
      params = params.set('status', status);
    }
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
    idFuncionario: number,
    idServico?: number
  ): Observable<PageableResponse<Agendamento>> {
    let params = new HttpParams().set('page', page).set('size', size);
    if (idServico) {
      params = params.set('idServico', idServico);
    }
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
    idFuncionario: number,
    status?: string,
    idServico?: number
  ): Observable<PageableResponse<Agendamento>> {
    let params = new HttpParams().set('page', page).set('size', size);
    if (status) {
      params = params.set('status', status);
    }
    if (idServico) {
      params = params.set('idServico', idServico);
    }
    return this.http.get<PageableResponse<Agendamento>>(
      `${this.apiUrl}/old/funcionario/${idFuncionario}`,
      {
        params,
      }
    );
  }

  getAgendamentosAdmin(
    page: number,
    size: number,
    idFuncionario?: number,
    idServico?: number
  ): Observable<PageableResponse<Agendamento>> {
    let params = new HttpParams().set('page', page).set('size', size);
    if (idServico) {
      params = params.set('idServico', idServico);
    }
    if (idFuncionario) {
      params = params.set('idFuncionario', idFuncionario);
    }
    return this.http.get<PageableResponse<Agendamento>>(
      `${this.apiUrl}/admin`,
      {
        params,
      }
    );
  }

  getOldAgendamentosAdmin(
    page: number,
    size: number,
    idFuncionario?: number,
    status?: string,
    idServico?: number
  ): Observable<PageableResponse<Agendamento>> {
    let params = new HttpParams().set('page', page).set('size', size);
    if (status) {
      params = params.set('status', status);
    }
    if (idServico) {
      params = params.set('idServico', idServico);
    }
    if (idFuncionario) {
      params = params.set('idFuncionario', idFuncionario);
    }
    return this.http.get<PageableResponse<Agendamento>>(
      `${this.apiUrl}/old/admin`,
      {
        params,
      }
    );
  }

  concluirAgendamento(id: number): Observable<Agendamento> {
    return this.http.put<Agendamento>(`${this.apiUrl}/concluir`, id);
  }
}
