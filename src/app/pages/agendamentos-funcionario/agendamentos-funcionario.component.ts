import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FuncionariosService } from '../../services/funcionarios.service';
import { UserInfo } from '../../models/userInfo';
import { AuthService } from '../../services/auth.service';
import { Funcionario } from '../../models/funcionario';
import { ToastrService } from 'ngx-toastr';
import { AgendamentoService } from '../../services/agendamento.service';
import { Agendamento } from '../../models/agendamento';
import { CommonModule } from '@angular/common';
import { NavigationComponent } from '../../components/navigation/navigation.component';
import { CurrencyBrPipe } from '../../pipes/currency-br.pipe';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-agendamentos-funcionario',
  standalone: true,
  imports: [CommonModule, FormsModule, NavigationComponent, CurrencyBrPipe],
  templateUrl: './agendamentos-funcionario.component.html',
  styleUrl: './agendamentos-funcionario.component.scss',
})
export class AgendamentosFuncionarioComponent implements OnInit {
  @ViewChild('closeModalCancel') closeModalCancel!: ElementRef;
  @ViewChild('concluirModalCancel') concluirModalCancel!: ElementRef;

  userInfo!: UserInfo;
  funcionario!: Funcionario;

  agendamentos: Agendamento[] = [];
  totalPagesAgendamentos = 0;
  oldAgendamentos: Agendamento[] = [];
  totalPagesOldAgendamentos = 0;

  id!: number;
  motivoCancelamento = '';

  constructor(
    private authService: AuthService,
    private funcionarioService: FuncionariosService,
    private agendamentoService: AgendamentoService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.userInfo = this.authService.getUserInfo();
    this.loadFuncionario();
  }

  loadFuncionario(): void {
    this.funcionarioService.getFuncionario(this.userInfo.id).subscribe({
      next: (funcionario) => {
        this.funcionario = funcionario;
        this.loadAgendamentos();
        this.loadOldAgendamentos();
      },
      error: () => {
        this.toastr.error('Erro ao carregar funcionário', 'Erro');
      },
    });
  }

  loadAgendamentos(currentPage: number = 0): void {
    this.agendamentoService
      .getAgendamentosFuncionario(currentPage, 2, this.funcionario.id!)
      .subscribe({
        next: (response) => {
          this.agendamentos = response.content;
          this.totalPagesAgendamentos = response.totalPages;
        },
        error: () => {
          this.toastr.error('Erro ao carregar agendamentos', 'Erro');
        },
      });
  }

  loadOldAgendamentos(currentPage: number = 0): void {
    this.agendamentoService
      .getOldAgendamentosFuncionario(currentPage, 2, this.funcionario.id!)
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
        next: () => {
          this.resetForm();
          this.closeModalCancel.nativeElement.click();
          this.loadAgendamentos();
          this.loadOldAgendamentos();
          this.toastr.success('Agendamento cancelado com sucesso!', 'Sucesso');
        },
        error: (err) => {
          this.toastr.error(err.error, 'Erro');
        },
      });
  }

  onOpenConcluirAgendamento(id: number): void {
    this.id = id;
  }

  onCloseConcluirAgendamento(): void {
    this.id = 0;
    this.motivoCancelamento = '';
    this.concluirModalCancel.nativeElement.click();
  }

  onConfirmConcluirAgendamento(): void {
    this.agendamentoService.concluirAgendamento(this.id).subscribe({
      next: () => {
        this.resetForm();
        this.concluirModalCancel.nativeElement.click();
        this.loadAgendamentos();
        this.loadOldAgendamentos();
        this.toastr.success('Agendamento concluído com sucesso!', 'Sucesso');
      },
      error: (err) => {
        this.toastr.error(err.error, 'Erro');
      },
    });
  }

  private resetForm(): void {
    this.id = 0;
    this.motivoCancelamento = '';
  }
}
