import { Component, ViewChild, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  PoButtonModule,
  PoDialogService,
  PoFieldModule,
  PoModalComponent,
  PoModalModule,
  PoNotificationService,
  PoPageAction,
  PoPageModule,
  PoTableAction,
  PoTableColumn,
  PoTableModule
} from '@po-ui/ng-components';
import { Aprovadores } from '../../models/aprovadores.model';
import { AprovadoresService } from '../../services/aprovadores.service';

import { Router } from '@angular/router';
@Component({
  selector: 'app-aprovadores-list',
  imports: [ FormsModule,
    PoPageModule,
    PoTableModule,
    PoModalModule,
    PoFieldModule,
    PoButtonModule],
  templateUrl: './aprovadores-list.html',
  styleUrl: './aprovadores-list.css',
})
export class AprovadoresList {
  @ViewChild('aprovadoresModal') aprovadoresModal!: PoModalComponent;
  items: Aprovadores[] = [];
  formItem: Aprovadores = {
    'codigo': '',
    'nome': '',
    'cargo': '',
    'lotacao': '',
    'estabelecimento': ''
  };
  isEditing = false;
  
  private router = inject(Router);

  readonly actions: PoPageAction[] = [
    { label: 'Novo', action: () => this.router.navigate(['/aprovadores/novo']), icon: 'po-icon-plus', kind: 'primary' }
    //{ label: 'Novo', action: () => this.openModal(), icon: 'po-icon-plus', kind: 'primary' }
  ];

  readonly columns: PoTableColumn[] = [
    { property: 'codigo', label: 'Usuario', type: 'string', width: '100px' },
    { property: 'nome', label: 'Nome', type: 'string', width: '200px' },
    { property: 'cargo', label: 'Cargo', type: 'string', width: '150px' },
    { property: 'lotacao', label: 'Lotação', type: 'string', width: '150px' },
    { property: 'estabelecimento', label: 'Estabelecimento', type: 'string', width: '150px' }
  ];

  readonly tableActions: PoTableAction[] = [
    { label: 'Editar', action: (item: Aprovadores) => this.router.navigate(['/aprovadores/editar', item.codigo]) },
    { label: 'Excluir', action: (item: Aprovadores) => this.confirmDelete(item) }
  ];

  constructor(
    private readonly aprovadoresService: AprovadoresService,
    private readonly dialogService: PoDialogService,
    private readonly notification: PoNotificationService
  ) {}

  ngOnInit(): void {
    console.log('AprovadoresList ngOnInit');
    this.loadItems();
  }

  loadItems(): void {
    console.log('AprovadoresList loadItems');
    this.aprovadoresService.getAll().subscribe({
      next: items => (this.items = items.items),
      error: () => this.notification.error('Não foi possível carregar os registros.')
    });
  }

  openModal(item?: Aprovadores): void {
    this.isEditing = !!item?.codigo;
    this.formItem = item ? { ...item } : {
      'codigo': '',
      'nome': '',
      'cargo': '',
      'lotacao': '',
      'estabelecimento': ''
    };
    this.aprovadoresModal.open();
  }

  closeModal(): void {
    this.aprovadoresModal.close();
  }

  save(): void {
    if (!this.formItem['codigo']?.trim()) {
      this.notification.error('Informe o código do usuário.');
      return;
    }

    const payload: Aprovadores = {
      ...this.formItem,
      'codigo': this.formItem['codigo'].trim()
    };

    const request = this.isEditing && this.formItem.codigo !== undefined
      ? this.aprovadoresService.update(this.formItem.codigo, payload)
      : this.aprovadoresService.create(payload);

    request.subscribe({
      next: () => {
        this.notification.success(this.isEditing ? 'Registro atualizado com sucesso.' : 'Registro criado com sucesso.');
        this.closeModal();
        this.loadItems();
      },
      error: () => this.notification.error('Não foi possível salvar o registro.')
    });
  }

  confirmDelete(item: Aprovadores): void {
    this.dialogService.confirm({
      title: 'Excluir registro',
      message: `Deseja realmente excluir o usuário ${item['nome']}?`,
      confirm: () => this.deleteItem(item)
    });
  }

  deleteItem(item: Aprovadores): void {
    if (item.codigo === undefined) {
      return;
    }

    this.aprovadoresService.delete(item.codigo).subscribe({
      next: () => {
        this.notification.success('Registro excluído com sucesso.');
        this.loadItems();
      },
      error: () => this.notification.error('Não foi possível excluir o registro.')
    });
  }
}
