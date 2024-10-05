import { Component } from '@angular/core';
import { Endereco } from '../../models/endereco';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgxMaskDirective } from 'ngx-mask';
import { Cliente } from '../../models/cliente';
import { AuthService } from '../../services/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, CommonModule, NgxMaskDirective],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {

  constructor(private authService: AuthService, private toastr: ToastrService) { }

  login: string = '';
  senha: string = '';
  nome: string = '';
  email: string = '';
  telefone: string = '';
  cpf: string = '';
  ativo: boolean = false;
  endereco: Endereco = {} as Endereco;
  errors: { [key: string]: string } = {};

  onSubmit(): void {
    this.errors = {};
    this.endereco.uf = !!this.endereco.uf ? this.endereco.uf.toUpperCase() : this.endereco.uf;
    const newCliente: Cliente = {
      login: this.login,
      senha: this.senha,
      nome: this.nome,
      email: this.email,
      telefone: this.telefone,
      cpf: this.cpf,
      endereco: this.endereco
    };

    this.authService.register(newCliente).subscribe({
      next: () => {
        this.toastr.success('Usuário registrado com sucesso!', 'Sucesso');
      },
      error: (err) => {
        this.toastr.error(
          'Não foi possível registrar o usuário!',
          'Erro'
        );
        this.setErrors(err.error);
      },
    });
  }

  setErrors(errorPayload: any): void {
    this.errors = {};
    errorPayload.forEach((error: { campo: string; mensagem: string }) => {
      this.errors[error.campo] = error.mensagem;
    });
  }

  onLoginBlur() {
    if (this.nome) {
      this.login = this.nome.toLowerCase().replace(/\s+/g, '');
    }
  }

}
