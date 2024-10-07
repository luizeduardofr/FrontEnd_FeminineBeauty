import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ServicosService } from '../../services/servicos.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { Servico } from '../../models/servico';
import { NgxMaskDirective } from 'ngx-mask';
import { CurrencyBrPipe } from '../../pipes/currency-br.pipe';
import { NavigationComponent } from '../../components/navigation/navigation.component';

@Component({
  selector: 'app-servicos',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    NgxMaskDirective,
    CurrencyBrPipe,
    NavigationComponent,
  ],
  templateUrl: './servicos.component.html',
  styleUrls: ['./servicos.component.scss'],
})
export class ServicosComponent implements OnInit {
  @ViewChild('closeModal') closeModal!: ElementRef;

  servicos: Servico[] = [];
  totalPages: number = 0;

  descricao: string = '';
  preco: number = 0;
  duracao: number = 0;
  ativo: boolean = false;
  id?: number;

  errors: { [key: string]: string } = {};

  constructor(
    private servicosService: ServicosService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.loadServicos();
  }

  loadServicos(currentPage: number = 0): void {
    this.servicosService.getServicos(currentPage, 10).subscribe({
      next: (response) => {
        this.servicos = response.content;
        this.totalPages = response.totalPages;
      },
      error: () =>
        this.toastr.error('Não foi possível buscar os funcionários!', 'Erro'),
    });
  }

  onSubmit(): void {
    this.errors = {};
    const newServico: Servico = {
      id: this.id,
      descricao: this.descricao,
      preco: this.preco,
      duracao: this.duracao,
      ativo: this.ativo,
    };
    if (this.id === undefined) {
      this.servicosService.addServico(newServico).subscribe({
        next: () => {
          this.resetForm();
          this.closeModal.nativeElement.click();
          this.loadServicos();
          this.toastr.success('Serviço adicionado com sucesso!', 'Sucesso');
        },
        error: (err) => {
          this.toastr.error('Não foi possível adicionar o serviço!', 'Erro');
          this.setErrors(err.error);
        },
      });
    } else {
      this.servicosService.updateServico(newServico).subscribe({
        next: (response) => {
          this.resetForm();
          this.closeModal.nativeElement.click();
          this.loadServicos();
          this.toastr.success('Serviço atualizado com sucesso!', 'Sucesso');
        },
        error: (err) => {
          this.toastr.error('Não foi possível atualizar o serviço!', 'Erro');
          this.setErrors(err.error);
        },
      });
    }
  }

  setErrors(errorPayload: any): void {
    this.errors = {};
    errorPayload.forEach((error: { campo: string; mensagem: string }) => {
      this.errors[error.campo] = error.mensagem;
    });
  }

  onEdit(editServico: Servico): void {
    this.resetForm();
    this.errors = {};
    this.id = editServico.id;
    this.descricao = editServico.descricao;
    this.preco = editServico.preco;
    this.duracao = editServico.duracao;
    this.ativo = editServico.ativo;
  }

  onDelete(id: number | undefined): void {
    this.servicosService.deleteServico(id as number).subscribe({
      next: () => {
        this.resetForm();
        this.loadServicos();
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
