import { Servico } from './servico';

export class Funcionario {
  constructor(
    public nome: string,
    public email: string,
    public telefone: string,
    public cpf: string,
    public ativo: boolean,
    public servicos: Servico[]
  ) {}
}
