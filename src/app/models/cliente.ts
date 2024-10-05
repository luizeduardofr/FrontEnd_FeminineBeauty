import { Endereco } from './endereco';

export interface Cliente {
  id?: number;
  login: string;
  senha?: string;
  nome: string;
  email: string;
  telefone: string;
  cpf: string;
  endereco: Endereco;
}
