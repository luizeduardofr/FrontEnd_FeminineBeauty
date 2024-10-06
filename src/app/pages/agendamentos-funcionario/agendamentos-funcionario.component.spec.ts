import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgendamentosFuncionarioComponent } from './agendamentos-funcionario.component';

describe('AgendamentosFuncionarioComponent', () => {
  let component: AgendamentosFuncionarioComponent;
  let fixture: ComponentFixture<AgendamentosFuncionarioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AgendamentosFuncionarioComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AgendamentosFuncionarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
