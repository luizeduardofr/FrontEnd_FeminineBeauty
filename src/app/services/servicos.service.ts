import { Injectable } from '@angular/core';
import { Servico } from '../models/servico';

@Injectable({
  providedIn: 'root',
})
export class ServicosService {
  private servicos: Servico[] = [];

  getServicos(): Servico[] {
    return this.servicos;
  }

  addServico(servico: Servico): void {
    this.servicos.push(servico);
  }

  updateServico(index: number, servico: Servico): void {
    this.servicos[index] = servico;
  }

  deleteServico(index: number): void {
    this.servicos.splice(index, 1);
  }
}
