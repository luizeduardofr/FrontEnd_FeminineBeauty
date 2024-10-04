import { Endereco } from './endereco';
import { Servico } from './servico';

export interface Funcionario {
  id?: number;
  login?: string;
  senha?: string;
  nome: string;
  email: string;
  telefone: string;
  cpf: string;
  ativo: boolean;
  endereco: Endereco;
  servicos: Servico[];
}
