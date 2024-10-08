import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Agendamento } from '../../models/agendamento';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Funcionario } from '../../models/funcionario';
import { Servico } from '../../models/servico';
import { ServicosService } from '../../services/servicos.service';
import { ToastrService } from 'ngx-toastr';
import { AgendamentoService } from '../../services/agendamento.service';
import { FuncionariosService } from '../../services/funcionarios.service';
import { NavigationComponent } from '../../components/navigation/navigation.component';
import { CurrencyBrPipe } from '../../pipes/currency-br.pipe';
import moment from 'moment-timezone';

@Component({
  selector: 'app-agendamentos-admin',
  standalone: true,
  imports: [CommonModule, FormsModule, NavigationComponent, CurrencyBrPipe],
  templateUrl: './agendamentos-admin.component.html',
  styleUrl: './agendamentos-admin.component.scss',
})
export class AgendamentosAdminComponent implements OnInit {
  @ViewChild('closeModal') closeModal!: ElementRef;
  @ViewChild('closeModalCancel') closeModalCancel!: ElementRef;

  @ViewChild('navigationComponent')
  navigationComponent!: NavigationComponent;

  @ViewChild('navigationOldComponent')
  navigationOldComponent!: NavigationComponent;

  servicos: Servico[] = [];
  funcionarios: Funcionario[] = [];

  defaultServico: Servico = {} as Servico;
  defaultFuncionario: Funcionario = {} as Funcionario;

  agendamentos: Agendamento[] = [];
  oldAgendamentos: Agendamento[] = [];

  totalPagesAgendamentos = 0;
  totalPagesOldAgendamentos = 0;

  filtroServico: Servico = this.defaultServico;
  filtroFuncionario: Funcionario = this.defaultFuncionario;

  filtroStatus: string = '';
  filtroServicoOld: Servico = this.defaultServico;
  filtroFuncionarioOld: Funcionario = this.defaultFuncionario;

  constructor(
    private agendamentoService: AgendamentoService,
    private servicosService: ServicosService,
    private funcionariosService: FuncionariosService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.loadAgendamentos();
    this.loadOldAgendamentos();
    this.loadFuncionarios();
    this.servicosService.getServicos(0, 999).subscribe({
      next: (response) => (this.servicos = response.content),
      error: () =>
        this.toastr.error('Não foi possível buscar os serviços!', 'Erro'),
    });
    this.funcionariosService.getFuncionarios(0, 999).subscribe({
      next: (response) => (this.funcionarios = response.content),
      error: () =>
        this.toastr.error('Não foi possível buscar os funcionários!', 'Erro'),
    });
  }

  loadAgendamentos(
    currentPage: number = 0,
    idServico?: number,
    idFuncionario?: number
  ): void {
    this.agendamentoService
      .getAgendamentosAdmin(
        currentPage,
        2,
        idServico,
        idFuncionario
      )
      .subscribe({
        next: (response) => {
          this.agendamentos = response.content;
          this.totalPagesAgendamentos = response.totalPages;
        },
        error: () =>
          this.toastr.error('Não foi possível buscar os agendamentos!', 'Erro'),
      });
  }

  loadOldAgendamentos(
    currentPage: number = 0,
    idServico?: number,
    idFuncionario?: number,
    status?: string
  ): void {
    this.agendamentoService
      .getOldAgendamentosAdmin(
        currentPage,
        2,
        idFuncionario,
        status,
        idServico,
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

  loadFuncionarios(): void {
    this.funcionariosService.getFuncionarios(0,999).subscribe({
      next: (response) => {
        this.funcionarios = response.content;
      },
      error: () =>
        this.toastr.error('Não foi possível buscar os funcionários!', 'Erro'),
    });
  }

  onFiltroServicoChange(servico: Servico): void {
    this.totalPagesAgendamentos = 0;
    this.navigationComponent?.resetNavigation();
    this.loadAgendamentos(0, servico.id, this.filtroFuncionario.id);
  }

  onFiltroFuncionarioChange(funcionario: Funcionario): void {
    this.totalPagesAgendamentos = 0;
    this.navigationComponent?.resetNavigation();
    this.loadAgendamentos(0, this.filtroServico.id, funcionario.id);
  }

  onFiltroServicoOldChange(servico: Servico): void {
    this.totalPagesOldAgendamentos = 0;
    this.navigationOldComponent?.resetNavigation();
    this.loadOldAgendamentos(
      0,
      servico.id,
      this.filtroFuncionario.id,
      this.filtroStatus
    );
  }

  onFiltroFuncionarioOldChange(funcionario: Funcionario): void {
    this.totalPagesOldAgendamentos = 0;
    this.navigationOldComponent?.resetNavigation();
    this.loadOldAgendamentos(
      0,
      this.filtroServico.id,
      funcionario.id,
      this.filtroStatus
    );
  }

  onFiltroStatusChange(status: string): void {
    this.totalPagesOldAgendamentos = 0;
    this.navigationComponent?.resetNavigation();
    this.loadOldAgendamentos(
      0,
      this.filtroServicoOld.id,
      this.filtroFuncionarioOld.id,
      status
    );
  }

  getFormatedData(data: Date): string {
    const convertedDate = moment.utc(data).tz("America/Sao_Paulo").format('DD/MM/YYYY HH:mm');
    return convertedDate;
  }
}
