import { Routes } from '@angular/router';
import { authGuard, notAuthenticatedGuard } from './auth/guards/auth.guard';

export const routes: Routes = [
    {
        path: 'auth',
        canActivate: [notAuthenticatedGuard],
        loadChildren: () => import('./auth/auth.routes')
    },
    {
        path: '',
        canActivate: [authGuard],
        loadChildren: () => import('./library-front/library-front.routing'),
    }
];
