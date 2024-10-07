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
import { Servico } from '../../models/servico';
import { ServicosService } from '../../services/servicos.service';

@Component({
  selector: 'app-agendamentos-funcionario',
  standalone: true,
  imports: [CommonModule, FormsModule, NavigationComponent, CurrencyBrPipe],
  templateUrl: './agendamentos-funcionario.component.html',
  styleUrl: './agendamentos-funcionario.component.scss',
})
export class AgendamentosFuncionarioComponent implements OnInit {
  @ViewChild('closeModalCancel')
  closeModalCancel!: ElementRef;

  @ViewChild('concluirModalCancel')
  concluirModalCancel!: ElementRef;

  @ViewChild('navigationComponent')
  navigationComponent!: NavigationComponent;

  @ViewChild('navigationOldComponent')
  navigationOldComponent!: NavigationComponent;

  userInfo!: UserInfo;
  funcionario!: Funcionario;
  servicosFuncionario: Servico[] = [];

  agendamentos: Agendamento[] = [];
  totalPagesAgendamentos = 0;
  oldAgendamentos: Agendamento[] = [];
  totalPagesOldAgendamentos = 0;

  id!: number;
  motivoCancelamento = '';
  status: string = '';

  defaultServico: Servico = {} as Servico;

  filtroServico: Servico = this.defaultServico;
  filtroServicoOld: Servico = this.defaultServico;

  constructor(
    private authService: AuthService,
    private servicoService: ServicosService,
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
        this.loadServicos(funcionario);
      },
      error: () => {
        this.toastr.error('Erro ao carregar funcionário', 'Erro');
      },
    });
  }

  loadServicos(funcionario: Funcionario): void {
    this.servicoService.getServicosByFuncionario(funcionario).subscribe({
      next: (response) => {
        this.servicosFuncionario = response;
      },
      error: () =>
        this.toastr.error('Não foi possível buscar os funcionários!', 'Erro'),
    });
  }

  loadAgendamentos(currentPage: number = 0, idServico?: number): void {
    this.agendamentoService
      .getAgendamentosFuncionario(
        currentPage,
        2,
        this.funcionario.id!,
        idServico
      )
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

  loadOldAgendamentos(
    currentPage: number = 0,
    status?: string,
    idServico?: number
  ): void {
    this.agendamentoService
      .getOldAgendamentosFuncionario(
        currentPage,
        2,
        this.funcionario.id!,
        status,
        idServico
      )
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

  onStatusChange(status: string): void {
    this.totalPagesOldAgendamentos = 0;
    this.navigationComponent?.resetNavigation();
    this.loadOldAgendamentos(0, status, this.filtroServicoOld.id);
  }

  onFiltroServicoOldChange(servico: Servico): void {
    this.totalPagesOldAgendamentos = 0;
    this.navigationOldComponent?.resetNavigation();
    this.loadOldAgendamentos(0, this.status, servico.id);
  }

  onFiltroServicoChange(servico: Servico): void {
    this.totalPagesAgendamentos = 0;
    this.navigationComponent?.resetNavigation();
    this.loadAgendamentos(0, servico.id);
  }
}
