import { Component, OnInit } from '@angular/core';
import { ServicosService } from '../../services/servicos.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
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
  editIndex: number | null = null;

  constructor(private servicosService: ServicosService) {}

  ngOnInit(): void {
    this.servicos = this.servicosService.getServicos();
  }

  onSubmit(): void {
    const newServico = new Servico(
      this.descricao,
      this.preco,
      this.duracao,
      this.ativo
    );
    if (this.editIndex === null) {
      this.servicosService.addServico(newServico);
    } else {
      this.servicosService.updateServico(this.editIndex, newServico);
      this.editIndex = null;
    }
    this.resetForm();
  }

  onEdit(index: number): void {
    const servico = this.servicos[index];
    this.descricao = servico.descricao;
    this.preco = servico.preco;
    this.duracao = servico.duracao;
    this.ativo = servico.ativo;
    this.editIndex = index;
  }

  onDelete(index: number): void {
    this.servicosService.deleteServico(index);
  }

  resetForm(): void {
    this.descricao = '';
    this.preco = 0;
    this.duracao = 0;
    this.ativo = false;
  }
}
