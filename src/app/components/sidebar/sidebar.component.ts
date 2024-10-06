import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { UserInfo } from '../../models/userInfo';

const menu = [
  {
    link: '/dashboard/servicos',
    name: 'Serviços',
    roles: ['admin'],
  },
  {
    link: '/dashboard/funcionarios',
    name: 'Funcionários',
    roles: ['admin'],
  },
  {
    link: '/dashboard/agendamentos',
    name: 'Agendamentos',
    roles: ['usuario'],
  },
  {
    link: '/dashboard/agendamentos/funcionario',
    name: 'Agendamentos',
    roles: ['funcionario'],
  },
];

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent {
  userInfo: UserInfo;

  constructor(public authService: AuthService) {
    this.userInfo = authService.getUserInfo();
  }

  getMenuItems() {
    return menu.filter((item) => item.roles.includes(this.userInfo.role));
  }
}
