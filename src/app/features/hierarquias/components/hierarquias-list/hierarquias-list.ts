import { Component, ViewChild, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  PoButtonModule,
  PoDialogService,
  PoFieldModule,
  PoModalComponent,
  PoModalModule,
  PoPageListComponent,
  PoModalAction,
  PoBreadcrumb,
  PoNotificationService,
  PoPageAction,
  PoPageModule,
  PoTableAction,
  PoTableColumn,
  PoTableModule,
  PoLoadingModule,
  PoPageFilter
} from '@po-ui/ng-components';

import { Hierarquias, HierarquiaGroup } from '../../models/hierarquias.model';
import { HierarquiasService } from '../../services/hierarquias.service';
import { Router } from '@angular/router';
type HierarquiaAgrupada = {
  estabelecimento:string;
  lotacao:string;
  tipoDocumento:string;
  registros: Hierarquias[];
  quantidade: number;
  expandido: boolean;
  [key:string]:unknown;
};

@Component({
  selector: 'app-hierarquias-list',
  imports: [FormsModule,
    PoLoadingModule,
    PoPageModule,
    PoTableModule,
    PoModalModule,
    PoFieldModule,
    PoButtonModule],
  templateUrl: './hierarquias-list.html',
  styleUrl: './hierarquias-list.css',
})
export class HierarquiasList {
  @ViewChild('advancedFilterModal', { static: true }) advancedFilterModal!: PoModalComponent;
  @ViewChild('poPageList', { static: true }) poPageList!: PoPageListComponent;

  items: HierarquiaAgrupada[] = [];
  itemsFiltered: HierarquiaAgrupada[] =  [];
  formItem: Hierarquias = {
    'sequencia':'',
    'codigo':'',
    'limite':0,
  };

  loading:boolean = false;
  private disclaimers:any[] = [];
  disclaimerGroup:any;
  isEditing = false;
  estabelecimento:string = '';
  lotacao:string = '';
  tipoDocumento:string = '';
  codigo:string = '';
  sequencia:string = '';
  pageSize:number = 10;
  page:number = 1;
  totalItems = 10;
  filtros:{[key:string]:unknown} = {pageSize:this.pageSize, page:this.page};

  get totalPages(): number {
    return Math.ceil(this.totalItems / this.pageSize);
  }

  

  get paginasVisiveis(): {label:string, value:number}[] {
    const total = this.totalPages;
    const atual = this.page;

    let inicio = Math.max(1, atual - 1);
    let fim = Math.min(total, atual + 1);
    
    if (atual == 1 ) fim ++;
    if (atual == total)  inicio --;
    if (fim > total) fim = total;
    if (inicio < 1) inicio = 1;
    const paginas:{label:string, value:number}[] = [];
    if (total == 0) return paginas;
    for (let i = inicio; i <= fim; i++) paginas.push({label:i.toString(), value:i});
    return paginas;
  }

  private poDialog = inject(PoDialogService);

  private router = inject(Router);

  readonly actions: PoPageAction[] = [
    { label: 'Novo', action: () => this.router.navigate(['/hierarquias/novo']), icon: 'po-icon-plus', kind: 'primary' }
  ];
  public readonly breadcrumb: PoBreadcrumb = {
    items: [{ label: 'Home', action: this.beforeRedirect.bind(this) }, { label: 'Hierarquias' }]
  };

  readonly columns: PoTableColumn[] = [
    { property: 'estabelecimento', label: 'Estabelecimento', type: 'string', width: '200px' },
    { property: 'lotacao', label: 'Lotação', type: 'string', width: '200px' },
    { property: 'tipoDocumento', label: 'Tipo Documento', type: 'string', width: '180px' },
    { property: 'quantidade', label: 'Qtd. registros', type: 'number', width: '140px' }
  ];

  
  readonly detailColumns: PoTableColumn[] = [
    { property: 'sequencia', label: 'Sequência', type: 'string', width: '120px' },
    { property: 'codigo', label: 'Aprovador', type: 'string', width: '180px' },
    { property: 'limite', label: 'Limite', type: 'currency', format: 'BRL', width: '180px' }
  ];

  readonly tableActions: PoTableAction[] = [
    {
      label: 'Editar',
      action: (item: HierarquiaAgrupada) => {
        if (!item) return;
        this.router.navigate(['/hierarquias/editar', item.estabelecimento, item.lotacao, item.tipoDocumento]);
      }
    },
    {
      label: 'Excluir',
      action: (item: Hierarquias | HierarquiaAgrupada) => {
        /*const registro = this.getPrimeiroRegistro(item as Hierarquias | HierarquiaAgrupada);
        if (!registro) return;
        this.confirmDelete(registro);*/
      }
    }
  ];

  public readonly advancedFilterPrimaryAction: PoModalAction = {
    action: () => {
      this.poPageList.clearInputSearch();
      this.advancedFilterModal.close();
      const filters = {estabelecimento:this.estabelecimento, lotacao:this.lotacao, tipoDocumento:this.tipoDocumento, codigo:this.codigo, sequencia:this.sequencia};
      this.filterAction(filters);
    },
    label: 'Aplicar'
  };

  public readonly filterSettings: PoPageFilter = {
    action: this.filterAction.bind(this),
    advancedAction: this.advancedFilterActionModal.bind(this),
    placeholder: 'Pesquisar'
  };

  constructor(
    private readonly hierarquiasService: HierarquiasService,
    private readonly dialogService: PoDialogService,
    private readonly notification: PoNotificationService
  ) {}

  ngOnInit(): void {
     this.disclaimerGroup = {
      disclaimers: [],
      change: this.onChangeDisclaimer.bind(this),
      remove: this.onClearDisclaimer.bind(this)
    };
    this.carregarPagina(1);
  }

  agruparHierarquias(registros: HierarquiaGroup[] = []): HierarquiaAgrupada[] {
    const grupos = new Map<string, HierarquiaAgrupada>();
    
    registros.forEach((registro) => {
      const chave = [
        registro.estabelecimento ?? '',
        registro.lotacao ?? '',
        registro.tipoDocumento ?? ''
      ].join('|');

      const registros:Hierarquias[] = registro.Hierarquias;

      grupos.set(chave,  {
        estabelecimento: registro.estabelecimento ?? '',
        lotacao: registro.lotacao ?? '',
        tipoDocumento: registro.tipoDocumento ?? '',
        registros: registros,
        quantidade: registros.length,
        expandido: false,
      });
    });

    return Array.from(grupos.values()).sort((a, b) => (
      `${a.estabelecimento}-${a.lotacao}-${a.tipoDocumento}`.localeCompare(`${b.estabelecimento}-${b.lotacao}-${b.tipoDocumento}`)
    ));
  } 

  showGroupDetail = (row: HierarquiaAgrupada): boolean => !!row?.registros?.length;

  carregarPagina(pagina: number) {
    //if (pagina < 1 || pagina > this.totalPages) return;
    this.loading = true;
    this.page = pagina;
    this.filtros['page'] = this.page;
    this.hierarquiasService.getByFilter(this.filtros).subscribe({
        next: (resposta) => {
          this.items = this.agruparHierarquias(resposta.items);
          this.totalItems = resposta.total;
          this.loading = false;
        },
        error: () => this.loading = false
      });
  }



  paginaAnterior() {
    this.carregarPagina(this.page - 1);
  }

  proximaPagina() {
    this.carregarPagina(this.page + 1);
  }

  onChangeDisclaimer(disclaimers:any) {
    this.disclaimers = disclaimers;
    this.filter();
  }

  onClearDisclaimer(disclaimers:any) {
    if (disclaimers.removedDisclaimer.property === 'search') {
      this.poPageList.clearInputSearch();
    }
    this.disclaimers = [];
    this.resetFilterItems();
  }

  populateDisclaimers(filters: Array<any>) {
    const property = filters.length > 1 ? 'advanced' : 'search';
    this.disclaimers = filters.map(value => {
      const chave = Object.keys(value)[0] ;
      const valor = value[chave];
      if (chave == 'labelFilter') return ({value:valor, property});
      return ({ value:`${chave}:${valor}`, property })
    });
    if (this.disclaimers && this.disclaimers.length > 0) {
      this.disclaimerGroup.disclaimers = [...this.disclaimers];
    } else {
      this.disclaimerGroup.disclaimers = [];
    }
  }

  private beforeRedirect(itemBreadcrumbLabel:any) {
    if (this.items.some(item => item['$selected'])) {
      this.poDialog.confirm({
        title: `Confirm redirect to ${itemBreadcrumbLabel}`,
        message: `There is data selected. Are you sure you want to quit?`,
        confirm: () => this.router.navigate(['/hierarquias'])
      });
    } else {
      this.router.navigate(['/']);
    }
  } 

  advancedFilterActionModal() {
    this.advancedFilterModal.open();
  }
  
  filterAction(labelFilter: string | {[key:string]:unknown}) {
    const filter = typeof labelFilter === 'string' ? {labelFilter}  : labelFilter;
    const filtrar = [];
    for (const key of Object.keys(filter)){
      if (filter[key] == '') continue;
      filtrar.push({[key]:filter[key]});
    }
    this.populateDisclaimers(filtrar);
    this.filter();
  }
  itemsFilter(filters:any) {
    for (const f of filters) {
      const chave = f.split(':')[0];
      const valor = f.split(':')[1];
      if (valor) this.filtros[chave] = valor;
    }
    this.carregarPagina(1);
  }

  includeFilter(item:any, filters:any[]) {
    const retorno = filters.some(filter => String(item).toLocaleLowerCase().includes(filter.toLocaleLowerCase()));
    return retorno;
  }

 filter() {
    const filters = this.disclaimers.map(disclaimer =>  disclaimer.value);
    filters.length ? this.itemsFilter(filters) : this.resetFilterItems();
  }

  resetFilterItems() {
    this.filtros = {pageSize:this.pageSize, page:this.page};
    this.estabelecimento = '';
    this.lotacao = '';
    this.codigo = '';
    this.sequencia = '';
    this.carregarPagina(1);
  }

  save(): void {
    if (!this.formItem['codigo']?.trim()) {
      this.notification.error('Informe o código do usuário.');
      return;
    }

    const payload: Hierarquias = {
      ...this.formItem,
      'codigo': this.formItem['codigo'].trim()
    };

    const request = this.isEditing && this.formItem.codigo !== undefined
      ? this.hierarquiasService.update(this.formItem.codigo, payload)
      : this.hierarquiasService.create(payload);

    request.subscribe({
      next: () => {
        this.notification.success(this.isEditing ? 'Registro atualizado com sucesso.' : 'Registro criado com sucesso.');
        this.carregarPagina(1);
      },
      error: () => this.notification.error('Não foi possível salvar o registro.')
    });
  }

  confirmDelete(item: Hierarquias): void {
    this.dialogService.confirm({
      title: 'Excluir registro',
      message: `Deseja realmente excluir a hierarquia?`,
      confirm: () => this.deleteItem(item)
    });
  }

  deleteItem(item: Hierarquias): void {
    if (item.codigo === undefined) {
      return;
    }
    this.hierarquiasService.delete(item.codigo).subscribe({
      next: () => {
        this.notification.success('Registro excluído com sucesso.');
        this.carregarPagina(1);
      },
      error: () => this.notification.error('Não foi possível excluir o registro.')
    });
  }
 
}
