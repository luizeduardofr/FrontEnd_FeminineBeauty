import { Component, OnInit, ViewChild } from '@angular/core';
import { Funcionario } from '../../models/funcionario';
import { AgendamentoService } from '../../services/agendamento.service';
import { NavigationComponent } from '../../components/navigation/navigation.component';
import { Agendamento, StatusConsulta } from '../../models/agendamento';
import { ToastrService } from 'ngx-toastr';
import { FuncionariosService } from '../../services/funcionarios.service';
import { CurrencyBrPipe } from '../../pipes/currency-br.pipe';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ServicosService } from '../../services/servicos.service';

@Component({
  selector: 'app-faturamento',
  standalone: true,
  imports: [CommonModule, FormsModule, CurrencyBrPipe],
  templateUrl: './faturamento.component.html',
  styleUrl: './faturamento.component.scss'
})
export class FaturamentoComponent implements OnInit {
  @ViewChild('navigationComponent')
  navigationComponent!: NavigationComponent;

  funcionarios: Funcionario[] = [];

  defaultFuncionario: Funcionario = {} as Funcionario;

  totalPagesAgendamentos = 0;

  funcionario: Funcionario = this.defaultFuncionario;

  filtroDataInicio: string = new Date().toISOString().split('T')[0];
  filtroDataFim: string = new Date().toISOString().split('T')[0];
  filtroFuncionario: Funcionario = this.defaultFuncionario;

  totalDia = 0;
  totalCancelado = 0;
  totalConcluido= 0;

  constructor(
    private toastr: ToastrService,
    private funcionariosService: FuncionariosService,
    private agendamentoService: AgendamentoService,
  ) {}

  ngOnInit(): void {
    this.loadFuncionarios();
  }

  onFiltroFuncionarioChange(funcionario: Funcionario): void {
    this.totalDia = 0;
    this.getFaturamento(funcionario.id as number, this.filtroDataInicio, this.filtroDataFim);
  }

  onFiltroDataChange(dataInicio: string, dataFim: string): void {
    this.totalDia = 0;
    this.getFaturamento(this.filtroFuncionario.id as number, dataInicio, dataFim);
  }

  getFaturamento(
    idFuncionario: number,
    dataInicio: string,
    dataFim: string
  ) {
    if (dataInicio > dataFim) {
      this.toastr.error('Data de início não pode ser maior que a data de fim!', 'Erro');
      return;
    } else {
      this.agendamentoService.getFaturamento(idFuncionario, dataInicio, dataFim).subscribe({
        next: (response) => {
          this.totalDia = response.reduce((acc: number, agendamento: Agendamento) => {
            if (agendamento.status?.toString() === StatusConsulta.CONCLUIDO.toString()) return acc + agendamento.servico.preco;
            return acc;
          }, 0);
          this.totalCancelado = response.reduce((acc: number, agendamento: Agendamento) => {
            if (agendamento.status?.toString() === StatusConsulta.CANCELADO.toString()) return acc + 1 ;
            return acc;
          }, 0);
          this.totalConcluido = response.reduce((acc: number, agendamento: Agendamento) => {
            if (agendamento.status?.toString() === StatusConsulta.CONCLUIDO.toString()) return acc + 1;
            return acc;
          }, 0);
        },
        error: () =>
          this.toastr.error('Não foi possível buscar o faturamento!', 'Erro'),
      });
    }
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
}
