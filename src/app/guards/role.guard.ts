import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ToastrService } from 'ngx-toastr';

export const roleGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const toastrServcie = inject(ToastrService);
  console.log(route, state);
  if (authService.hasPermission(state.url)) {
    return true;
  } else {
    toastrServcie.error('Você não tem permissão para acessar essa página');
    return false;
  }
};
