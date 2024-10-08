import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgendamentosAdminComponent } from './agendamentos-admin.component';

describe('AgendamentosAdminComponent', () => {
  let component: AgendamentosAdminComponent;
  let fixture: ComponentFixture<AgendamentosAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AgendamentosAdminComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AgendamentosAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
