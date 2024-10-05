import { inject } from '@angular/core';
import { CanActivateChildFn } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ToastrService } from 'ngx-toastr';

export const roleGuard: CanActivateChildFn = (_, state) => {
  const authService = inject(AuthService);
  const toastrServcie = inject(ToastrService);
  if (authService.hasPermission(state.url)) {
    return true;
  } else {
    toastrServcie.error('Você não tem permissão para acessar essa página');
    return false;
  }
};
