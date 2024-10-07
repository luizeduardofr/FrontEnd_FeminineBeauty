import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FuncionariosService } from '../../services/funcionarios.service';
import { ServicosService } from '../../services/servicos.service';
import { Servico } from '../../models/servico';
import { ToastrService } from 'ngx-toastr';
import { Funcionario } from '../../models/funcionario';
import { Endereco } from '../../models/endereco';
import { NgxMaskDirective } from 'ngx-mask';
import { NavigationComponent } from '../../components/navigation/navigation.component';

@Component({
  selector: 'app-funcionarios',
  standalone: true,
  imports: [FormsModule, CommonModule, NgxMaskDirective, NavigationComponent],
  templateUrl: './funcionarios.component.html',
  styleUrls: ['./funcionarios.component.scss'],
})
export class FuncionariosComponent implements OnInit {
  @ViewChild('closeModal') closeModal!: ElementRef;

  funcionarios: Funcionario[] = [];
  totalPages: number = 0;

  defaultServico: Servico = {} as Servico;

  login?: string = '';
  nome: string = '';
  email: string = '';
  telefone: string = '';
  cpf: string = '';
  ativo: boolean = false;
  endereco: Endereco = {} as Endereco;
  servicos: Servico[] = [];
  selectedServicos: Servico[] = [];
  selectedServico: Servico = this.defaultServico;
  id?: number;

  errors: { [key: string]: string } = {};

  constructor(
    private funcionariosService: FuncionariosService,
    private servicosService: ServicosService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.loadFuncionarios();
    this.servicosService.getServicos(0, 999).subscribe({
      next: (response) => (this.servicos = response.content),
      error: () =>
        this.toastr.error('Não foi possível buscar os serviços!', 'Erro'),
    });
  }

  loadFuncionarios(currentPage: number = 0): void {
    this.funcionariosService.getFuncionarios(currentPage, 10).subscribe({
      next: (response) => {
        this.resetForm();
        this.funcionarios = response.content;
        this.totalPages = response.totalPages;
      },
      error: () =>
        this.toastr.error('Não foi possível buscar os funcionários!', 'Erro'),
    });
  }

  onSubmit(): void {
    this.errors = {};
    this.endereco.uf = !!this.endereco.uf
      ? this.endereco.uf.toUpperCase()
      : this.endereco.uf;
    const newFuncionario: Funcionario = {
      id: this.id,
      nome: this.nome,
      email: this.email,
      telefone: this.telefone,
      cpf: this.cpf,
      ativo: this.ativo,
      endereco: this.endereco,
      servicos: this.selectedServicos,
      login: this.login,
      senha: this.email,
    };
    if (this.id === undefined) {
      this.funcionariosService.addFuncionario(newFuncionario).subscribe({
        next: () => {
          this.loadFuncionarios();
          this.toastr.success('Funcionário adicionado com sucesso!', 'Sucesso');
        },
        error: (err) => {
          this.toastr.error(
            'Não foi possível adicionar o funcionário!',
            'Erro'
          );
          this.setErrors(err.error);
        },
      });
    } else {
      this.funcionariosService.updateFuncionario(newFuncionario).subscribe({
        next: (response) => {
          const index = this.funcionarios.findIndex(
            (fun) => fun.id == response.id
          );
          this.resetForm();
          this.funcionarios.splice(index, 1, response);
          this.toastr.success('Funcionário atualizado com sucesso!', 'Sucesso');
        },
        error: (err) => {
          this.toastr.error(
            'Não foi possível atualizar o funcionário!',
            'Erro'
          );
          this.setErrors(err.error);
        },
      });
    }
  }

  setErrors(errorPayload: any): void {
    this.errors = {};
    errorPayload.forEach((error: { campo: string; mensagem: string }) => {
      this.errors[error.campo] = error.mensagem;
    });
  }

  onEdit(editFuncionario: Funcionario): void {
    this.errors = {};
    this.selectedServico = this.defaultServico;
    this.id = editFuncionario.id;
    this.nome = editFuncionario.nome;
    this.email = editFuncionario.email;
    this.telefone = editFuncionario.telefone;
    this.cpf = editFuncionario.cpf;
    this.ativo = editFuncionario.ativo!;
    this.endereco = editFuncionario.endereco;
    this.selectedServicos = editFuncionario.servicos || [];
    this.login = editFuncionario.login;
  }

  onDelete(id: number | undefined): void {
    this.funcionariosService.deleteFuncionario(id as number).subscribe({
      next: () => {
        this.loadFuncionarios();
        this.toastr.success('Funcionário removido com sucesso!', 'Sucesso');
      },
      error: () =>
        this.toastr.error('Não foi possível remover o funcionário!', 'Erro'),
    });
  }

  resetForm(): void {
    this.closeModal.nativeElement.click();
    this.id = undefined;
    this.login = '';
    this.nome = '';
    this.email = '';
    this.telefone = '';
    this.cpf = '';
    this.ativo = false;
    this.endereco = {} as Endereco;
    this.selectedServicos = [];
    this.selectedServico = this.defaultServico;
    this.errors = {};
  }

  onLoginBlur() {
    if (this.nome) {
      this.login = this.nome.toLowerCase().replace(/\s+/g, '');
    }
  }

  addServico(): void {
    if (
      this.selectedServico &&
      !this.selectedServicos.includes(this.selectedServico)
    ) {
      this.selectedServicos.push(this.selectedServico);
      this.selectedServico = this.defaultServico;
    }
  }

  removeServico(servico: Servico): void {
    this.selectedServicos = this.selectedServicos.filter((s) => s !== servico);
  }
}
