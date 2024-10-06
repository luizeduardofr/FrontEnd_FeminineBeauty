import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Agendamento } from '../../models/agendamento';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Funcionario } from '../../models/funcionario';
import { Cliente } from '../../models/cliente';
import { Servico } from '../../models/servico';
import { ServicosService } from '../../services/servicos.service';
import { ToastrService } from 'ngx-toastr';
import { AgendamentoService } from '../../services/agendamento.service';
import { FuncionariosService } from '../../services/funcionarios.service';
import { ClientesService } from '../../services/cliente.service';
import { AuthService } from '../../services/auth.service';
import { UserInfo } from '../../models/userInfo';
import { NavigationComponent } from '../../components/navigation/navigation.component';
import { CurrencyBrPipe } from '../../pipes/currency-br.pipe';

@Component({
  selector: 'app-agendamentos',
  standalone: true,
  imports: [CommonModule, FormsModule, NavigationComponent, CurrencyBrPipe],
  templateUrl: './agendamentos.component.html',
  styleUrl: './agendamentos.component.scss',
})
export class AgendamentosComponent implements OnInit {
  @ViewChild('closeModal') closeModal!: ElementRef;
  @ViewChild('closeModalCancel') closeModalCancel!: ElementRef;

  userInfo!: UserInfo;

  servicos: Servico[] = [];
  funcionarios: Funcionario[] = [];

  agendamentos: Agendamento[] = [];
  oldAgendamentos: Agendamento[] = [];
  data = new Date();
  tipoPagamento = '';
  funcionario: Funcionario = {} as Funcionario;
  cliente: Cliente = {} as Cliente;
  servico: Servico = {} as Servico;

  id = 0;
  motivoCancelamento = '';

  totalPagesAgendamentos = 0;
  totalPagesOldAgendamentos = 0;

  errors: { [key: string]: string } = {};

  constructor(
    private authService: AuthService,
    private agendamentoService: AgendamentoService,
    private servicosService: ServicosService,
    private funcionariosService: FuncionariosService,
    private clienteService: ClientesService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.userInfo = this.authService.getUserInfo();
    this.loadCliente();
    this.servicosService.getServicos(0, 999).subscribe({
      next: (response) => (this.servicos = response.content),
      error: () =>
        this.toastr.error('Não foi possível buscar os serviços!', 'Erro'),
    });
  }

  loadCliente(): void {
    this.clienteService.getCliente(this.userInfo.id).subscribe({
      next: (response) => {
        this.cliente = response;
        this.loadAgendamentos();
        this.loadOldAgendamentos();
      },
      error: () =>
        this.toastr.error('Não foi possível buscar o cliente!', 'Erro'),
    });
  }

  loadAgendamentos(currentPage: number = 0): void {
    this.agendamentoService
      .getAgendamentosCliente(currentPage, 2, this.cliente.id!)
      .subscribe({
        next: (response) => {
          this.agendamentos = response.content;
          this.totalPagesAgendamentos = response.totalPages;
        },
        error: () =>
          this.toastr.error('Não foi possível buscar os agendamentos!', 'Erro'),
      });
  }

  loadOldAgendamentos(currentPage: number = 0): void {
    this.agendamentoService
      .getOldAgendamentosCliente(currentPage, 2, this.cliente.id!)
      .subscribe({
        next: (response) => {
          this.oldAgendamentos = response.content;
          this.totalPagesOldAgendamentos = response.totalPages;
        },
        error: () =>
          this.toastr.error(
            'Não foi possível buscar os agendamentos antigos!',
            'Erro'
          ),
      });
  }

  onServicoChange(servico: Servico): void {
    this.loadFuncionarios(servico);
  }

  loadFuncionarios(servico: Servico): void {
    this.funcionariosService.getFuncionariosByServico(servico).subscribe({
      next: (response) => {
        this.funcionarios = response;
      },
      error: () =>
        this.toastr.error('Não foi possível buscar os funcionários!', 'Erro'),
    });
  }

  onSubmit(): void {
    this.errors = {};
    const newAgendamento: Agendamento = {
      data: new Date(this.data),
      tipoPagamento: this.tipoPagamento,
      funcionario: this.funcionario,
      cliente: this.cliente,
      servico: this.servico,
    };
    this.agendamentoService.addAgendamento(newAgendamento).subscribe({
      next: () => {
        this.resetForm();
        this.closeModal.nativeElement.click();
        this.loadAgendamentos();
        this.toastr.success('Agendamento realizado com sucesso!', 'Sucesso');
      },
      error: (err) => {
        this.toastr.error('Não foi possível realizar o agendamento!', 'Erro');
        this.setErrors(err.error);
      },
    });
  }

  onOpenCancelAgendamento(id: number): void {
    this.id = id;
    this.motivoCancelamento = '';
  }

  onCloseCancelAgendamento(): void {
    this.id = 0;
    this.motivoCancelamento = '';
    this.closeModalCancel.nativeElement.click();
  }

  onCancel(): void {
    this.agendamentoService
      .cancelAgendamento(this.id, this.motivoCancelamento)
      .subscribe({
        next: (response) => {
          console.log(response);
          this.resetForm();
          this.closeModalCancel.nativeElement.click();
          this.loadAgendamentos();
          this.loadOldAgendamentos();
          this.toastr.success('Agendamento cancelado com sucesso!', 'Sucesso');
        },
        error: (err) => {
          console.error(err);
          this.toastr.error('Não foi possível cancelar o agendamento!', 'Erro');
        },
      });
  }

  resetForm(): void {
    this.data = new Date();
    this.tipoPagamento = '';
    this.funcionario = {} as Funcionario;
    this.servico = {} as Servico;
    this.funcionarios = [];
    this.id = 0;
    this.motivoCancelamento = '';
  }

  setErrors(errorPayload: any): void {
    this.errors = {};
    errorPayload.forEach((error: { campo: string; mensagem: string }) => {
      this.errors[error.campo] = error.mensagem;
    });
  }
}
