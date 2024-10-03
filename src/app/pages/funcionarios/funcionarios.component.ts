import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FuncionariosService } from '../../services/funcionarios.service';
import { ServicosService } from '../../services/servicos.service';
import { Funcionario } from '../../models/funcionario';
import { Servico } from '../../models/servico';

@Component({
  selector: 'app-funcionarios',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './funcionarios.component.html',
  styleUrls: ['./funcionarios.component.scss'],
})
export class FuncionariosComponent implements OnInit {
  funcionarios: Funcionario[] = [];
  nome: string = '';
  email: string = '';
  telefone: string = '';
  cpf: string = '';
  ativo: boolean = false;
  servicos: Servico[] = [];
  selectedServicos: Servico[] = [];
  selectedServico: Servico | null = null;
  editIndex: number | null = null;

  constructor(
    private funcionariosService: FuncionariosService,
    private servicosService: ServicosService
  ) {}

  ngOnInit(): void {
    this.funcionarios = this.funcionariosService.getFuncionarios();
    this.servicos = this.servicosService.getServicos();
  }

  onSubmit(): void {
    const newFuncionario = new Funcionario(
      this.nome,
      this.email,
      this.telefone,
      this.cpf,
      this.ativo,
      this.selectedServicos
    );
    if (this.editIndex === null) {
      this.funcionariosService.addFuncionario(newFuncionario);
    } else {
      this.funcionariosService.updateFuncionario(
        this.editIndex,
        newFuncionario
      );
      this.editIndex = null;
    }
    this.resetForm();
  }

  onEdit(index: number): void {
    const funcionario = this.funcionarios[index];
    this.nome = funcionario.nome;
    this.email = funcionario.email;
    this.telefone = funcionario.telefone;
    this.cpf = funcionario.cpf;
    this.ativo = funcionario.ativo;
    this.selectedServicos = funcionario.servicos;
    this.editIndex = index;
  }

  onDelete(index: number): void {
    this.funcionariosService.deleteFuncionario(index);
  }

  resetForm(): void {
    this.nome = '';
    this.email = '';
    this.telefone = '';
    this.cpf = '';
    this.ativo = false;
    this.selectedServicos = [];
    this.selectedServico = null;
  }

  addServico(): void {
    if (
      this.selectedServico &&
      !this.selectedServicos.includes(this.selectedServico)
    ) {
      this.selectedServicos.push(this.selectedServico);
      this.selectedServico = null;
    }
  }

  removeServico(servico: Servico): void {
    this.selectedServicos = this.selectedServicos.filter((s) => s !== servico);
  }
}
