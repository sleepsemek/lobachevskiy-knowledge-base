import {AuthService} from '../services/auth.service';
import {inject} from '@angular/core';

export const authInitializer = async () => {
  const authService = inject(AuthService);
  await authService.initialize();
};
