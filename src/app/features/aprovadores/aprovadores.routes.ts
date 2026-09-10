import { Routes } from '@angular/router';

export const aprovadoresRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./components/aprovadores-list/aprovadores-list').then(
        (m) => m.AprovadoresList
      ),
  },
  {
    path: 'novo',
    loadComponent: () =>
      import('./components/aprovadores-form/aprovadores-form').then(
        (m) => m.AprovadoresForm
      ),
  },
  {
    path: 'editar/:id',
    loadComponent: () =>
      import('./components/aprovadores-form/aprovadores-form').then(
        (m) => m.AprovadoresForm
      ),
  },
];
