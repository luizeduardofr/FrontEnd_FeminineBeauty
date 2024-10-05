import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { UserInfo } from '../../models/userInfo';

const menu = [];

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
}