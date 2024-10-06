import { Cliente } from './cliente';
import { Funcionario } from './funcionario';
import { Servico } from './servico';

export interface Agendamento {
  id?: number;
  data: Date;
  tipoPagamento: string;
  status?: StatusConsulta;

  funcionario: Funcionario;
  cliente: Cliente;
  servico: Servico;
}

export interface CancelamentoAgendamento {
  id: number;
  motivoCancelamento: string;
}

export enum StatusConsulta {
  PENDENTE,
  CANCELADO,
  CONCLUIDO,
}
