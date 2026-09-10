import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'aprovadores', pathMatch: 'full' },
  { path:'aprovadores', loadChildren: () => import('./features/aprovadores/aprovadores.routes').then(m => m.aprovadoresRoutes)},
  { path:'hierarquias', loadChildren: () => import('./features/hierarquias/hierarquias.routes').then(m => m.hierarquiasRoutes)},

];


