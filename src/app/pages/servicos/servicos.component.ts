import { Component, OnInit } from '@angular/core';
import { ServicosService } from '../../services/servicos.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { Servico } from '../../models/servico';

@Component({
  selector: 'app-servicos',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './servicos.component.html',
  styleUrls: ['./servicos.component.scss'],
})
export class ServicosComponent implements OnInit {
  servicos: Servico[] = [];
  descricao: string = '';
  preco: number = 0;
  duracao: number = 0;
  ativo: boolean = false;
  id?: number;

  constructor(
    private servicosService: ServicosService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.servicosService.getServicos().subscribe({
      next: (response) => (this.servicos = response.content),
      error: () =>
        this.toastr.error('Não foi possível buscar os serviços!', 'Erro'),
    });
  }

  onSubmit(): void {
    const newServico: Servico = {
      id: this.id,
      descricao: this.descricao,
      preco: this.preco,
      duracao: this.duracao,
      ativo: this.ativo,
    };
    if (this.id === undefined) {
      this.servicosService.addServico(newServico).subscribe({
        next: (response) => {
          this.servicos.push(response);
          this.toastr.success('Serviço adicionado com sucesso!', 'Sucesso');
        },
        error: () =>
          this.toastr.error('Não foi possível adicionar o serviço!', 'Erro'),
      });
    } else {
      this.servicosService.updateServico(newServico).subscribe({
        next: (response) => {
          const index = this.servicos.findIndex((ser) => ser.id == response.id);
          this.servicos.splice(index, 1, response);
          this.toastr.success('Serviço atualizado com sucesso!', 'Sucesso');
        },
        error: () =>
          this.toastr.error('Não foi possível atualizar o serviço!', 'Erro'),
      });
    }
    this.resetForm();
  }

  onEdit(editServico: Servico): void {
    this.id = editServico.id;
    this.descricao = editServico.descricao;
    this.preco = editServico.preco;
    this.duracao = editServico.duracao;
    this.ativo = editServico.ativo;
  }

  onDelete(id: number | undefined): void {
    this.servicosService.deleteServico(id as number).subscribe({
      next: () => {
        const index = this.servicos.findIndex((ser) => ser.id == id);
        this.servicos.splice(index, 1);
        this.toastr.success('Serviço removido com sucesso!', 'Sucesso');
      },
      error: () =>
        this.toastr.error('Não foi possível remover o serviço!', 'Erro'),
    });
  }

  resetForm(): void {
    this.id = undefined;
    this.descricao = '';
    this.preco = 0;
    this.duracao = 0;
    this.ativo = false;
  }
}
