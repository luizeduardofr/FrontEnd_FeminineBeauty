import { Endereco } from './endereco';

export interface Cliente {
  login: string;
  senha: string;
  nome: string;
  email: string;
  telefone: string;
  cpf: string;
  endereco: Endereco;
}
