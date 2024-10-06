import { inject } from '@angular/core';
import { CanActivateChildFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ToastrService } from 'ngx-toastr';

export const roleGuard: CanActivateChildFn = (_, state) => {
  const authService = inject(AuthService);
  const toastrServcie = inject(ToastrService);
  const router = inject(Router);

  if (authService.hasPermission(state.url)) {
    return true;
  } else {
    toastrServcie.error('Você não tem permissão para acessar essa página');
    router.navigate(['/login']);
    return false;
  }
};
