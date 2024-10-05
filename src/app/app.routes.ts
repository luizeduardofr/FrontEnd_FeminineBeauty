import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { NgModule } from '@angular/core';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { ServicosComponent } from './pages/servicos/servicos.component';
import { FuncionariosComponent } from './pages/funcionarios/funcionarios.component';
import { RegisterComponent } from './pages/register/register.component';
import { authGuard } from './guards/auth.guard';
import { roleGuard } from './guards/role.guard';
import { PerfilComponent } from './pages/perfil/perfil.component';
import { AgendamentosComponent } from './pages/agendamentos/agendamentos.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [authGuard],
    canActivateChild: [roleGuard],
    children: [
      {
        path: 'perfil',
        component: PerfilComponent,
      },
      {
        path: 'servicos',
        component: ServicosComponent,
      },
      {
        path: 'funcionarios',
        component: FuncionariosComponent,
      },
      {
        path: 'agendamentos',
        component: AgendamentosComponent,
      },
    ],
  },
  { path: '**', redirectTo: 'login' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
