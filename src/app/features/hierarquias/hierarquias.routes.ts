import { Routes } from '@angular/router';

export const hierarquiasRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./components/hierarquias-list/hierarquias-list').then(
        (m) => m.HierarquiasList
      ),
  },
  {
    path: 'novo',
    loadComponent: () =>
      import('./components/hierarquias-form/hierarquias-form').then(
        (m) => m.HierarquiasForm
      ),
  },
  {
    path: 'editar/:estabelecimento/:lotacao/:tipoDocumento/:sequencia',
    loadComponent: () =>
      import('./components/hierarquias-form/hierarquias-form').then(
        (m) => m.HierarquiasForm
      ),
  },
];
