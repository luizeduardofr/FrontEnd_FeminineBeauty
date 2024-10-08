import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgxMaskDirective } from 'ngx-mask';
import { Endereco } from '../../models/endereco';
import { AuthService } from '../../services/auth.service';
import { FuncionariosService } from '../../services/funcionarios.service';
import { ClientesService } from '../../services/cliente.service';
import { ToastrService } from 'ngx-toastr';
import { Funcionario } from '../../models/funcionario';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [FormsModule, CommonModule, NgxMaskDirective],
  templateUrl: './perfil.component.html',
  styleUrl: './perfil.component.scss',
})
export class PerfilComponent implements OnInit {
  role!: string;
  userId!: number;

  id!: number;
  login: string = '';
  senha?: string;
  nome: string = '';
  email: string = '';
  telefone: string = '';
  cpf: string = '';
  endereco: Endereco = {} as Endereco;
  errors: { [key: string]: string } = {};

  constructor(
    private funcionarioService: FuncionariosService,
    private clienteService: ClientesService,
    private authService: AuthService,
    private toastrService: ToastrService
  ) {
    this.role = authService.getUserInfo().role;
    this.userId = this.authService.getUserInfo().id;
  }

  ngOnInit(): void {
    if (this.role === 'funcionario') {
      this.funcionarioService.getFuncionario(this.userId).subscribe({
        next: (funcionario) => {
          this.id = funcionario.id as number;
          this.login = funcionario.login as string;
          this.nome = funcionario.nome;
          this.email = funcionario.email;
          this.telefone = funcionario.telefone;
          this.cpf = funcionario.cpf;
          this.endereco = funcionario.endereco;
        },
        error: () => {
          this.toastrService.error('Erro ao carregar perfil', 'Erro');
        },
      });
    } else {
      this.clienteService.getCliente(this.userId).subscribe({
        next: (cliente) => {
          this.id = cliente.id as number;
          this.login = cliente.login as string;
          this.nome = cliente.nome;
          this.email = cliente.email;
          this.telefone = cliente.telefone;
          this.cpf = cliente.cpf;
          this.endereco = cliente.endereco;
        },
        error: () => {
          this.toastrService.error('Erro ao carregar perfil', 'Erro');
        },
      });
    }
  }

  onSubmit(): void {
    if (this.role === 'funcionario') {
      const funcionario: Funcionario = {
        id: this.id,
        login: this.login,
        nome: this.nome,
        email: this.email,
        telefone: this.telefone,
        cpf: this.cpf,
        endereco: this.endereco,
      };
      this.funcionarioService.updateFuncionario(funcionario).subscribe({
        next: () => {
          if (this.senha) {
            this.alterarSenha(this.senha);
          }
          this.toastrService.success(
            'Perfil atualizado com sucesso',
            'Sucesso'
          );
        },
        error: (err) => {
          this.toastrService.error('Erro ao atualizar perfil', 'Erro');
          this.setErrors(err.error);
        },
      });
    } else {
      this.clienteService
        .updateCliente({
          id: this.id,
          login: this.login,
          nome: this.nome,
          email: this.email,
          telefone: this.telefone,
          cpf: this.cpf,
          endereco: this.endereco,
        })
        .subscribe({
          next: () => {
            if (this.senha) {
              this.alterarSenha(this.senha);
            }
            this.toastrService.success(
              'Perfil atualizado com sucesso',
              'Sucesso'
            );
          },
          error: (err) => {
            this.toastrService.error('Erro ao atualizar perfil', 'Erro');
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

  alterarSenha(senha: string): void {
    this.authService.alterarSenha(senha).subscribe({
      next: () => {
        this.toastrService.success(
          'Senha alterada com sucesso',
          'Sucesso'
        );
      },
      error: () => {
        this.toastrService.error('Erro ao atualizar a senha', 'Erro');
      },
    });
  }
}
