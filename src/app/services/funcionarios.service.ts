import { Injectable } from '@angular/core';
import { Funcionario } from '../models/funcionario';

@Injectable({
  providedIn: 'root',
})
export class FuncionariosService {
  private funcionarios: Funcionario[] = [];

  getFuncionarios(): Funcionario[] {
    return this.funcionarios;
  }

  addFuncionario(funcionario: Funcionario): void {
    this.funcionarios.push(funcionario);
  }

  updateFuncionario(index: number, funcionario: Funcionario): void {
    this.funcionarios[index] = funcionario;
  }

  deleteFuncionario(index: number): void {
    this.funcionarios.splice(index, 1);
  }
}
