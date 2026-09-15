import { Component, ViewChild, inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { 
  PoModalAction,
  PoModalModule,
  PoToasterMode,
  PoDialogService,
  PoPageAction,
  PoModalComponent,
  PoTableAction, 
  PoTableColumn, 
  PoButtonModule, 
  PoDynamicFormComponent, 
  PoDynamicFormField, 
  PoDynamicFormFieldChanged, 
  PoDynamicFormValidation, 
  PoDynamicModule, 
  PoFieldModule,
  PoHeaderModule, 
  PoNotificationService, 
  PoPageModule, 
  PoTableModule, 
  PoNotification
} from '@po-ui/ng-components';

import { HierarquiaGroup, Hierarquias } from '../../models/hierarquias.model';
import { HierarquiasService } from '../../services/hierarquias.service';
import { AprovadoresService } from '../../../aprovadores/services/aprovadores.service';
import { Aprovadores } from '../../../aprovadores/models/aprovadores.model';
import { Observable } from 'rxjs';
import { AprovadoresComboFilter } from '../../../../shared/services/aprovadores-combo-filter';
import { EstabelecimentoComboFilter } from '../../../../shared/services/estabelecimento-combo-filter';
import { LotacaoComboFilter } from '../../../../shared/services/lotacao-combo-filter';
import { TipoDocumentoComboFilter } from '../../../../shared/services/tipoDocumento-combo-filter';

@Component({
  selector: 'app-hierarquias-form',
  standalone: true,
  imports: [
    PoModalModule,
    FormsModule,
    ReactiveFormsModule,
    PoDynamicModule,
    PoPageModule,
    PoButtonModule,
    PoFieldModule,
    PoHeaderModule,
    PoTableModule
],
  templateUrl: './hierarquias-form.html',
  styleUrl: './hierarquias-form.css',
})
export class HierarquiasForm {
  private readonly hierarquiasService = inject(HierarquiasService);
  private readonly aprovadoresService = inject(AprovadoresService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly notification = inject(PoNotificationService);
  private readonly aprovadoresComboFilter = inject(AprovadoresComboFilter);
  private readonly estabelecimentosComboFilter = inject(EstabelecimentoComboFilter);
  private readonly lotacoesComboFilter = inject(LotacaoComboFilter);
  private readonly tipoDocumentoComboFilter = inject(TipoDocumentoComboFilter);
  
  readonly toasterMode = PoToasterMode;

  @ViewChild('dynamicForm', { static: true }) dynamicForm?: PoDynamicFormComponent;
  @ViewChild('editarHierarquiaModal') editarHierarquiaModal!: PoModalComponent;

  isEditing: boolean = false;
  isEditingHierarquia: boolean = true;
  

  aprovadores: Observable<Aprovadores> = new Observable;
  
  constructor(private readonly dialogService: PoDialogService){}

  readonly fields: Array<PoDynamicFormField> = [
    { property: 'estabelecimento', label: 'Estabelecimento', gridColumns: 6, required: true , disabled: this.isEditing, optionsService: this.estabelecimentosComboFilter},
    { property: 'lotacao', label: 'Lotação', gridColumns: 6, required: true , disabled: this.isEditing, optionsService: this.lotacoesComboFilter},
    { property: 'tipoDocumento', label: 'Tipo Documento', gridColumns: 6, required: true , disabled: this.isEditing, optionsService: this.tipoDocumentoComboFilter},
  ];

  editFields: Array<PoDynamicFormField> = [
    { property: 'sequencia', label: 'Seq', gridColumns: 12, required: true , disabled: this.isEditingHierarquia},
    { property: 'codigo', label: 'Aprovador', gridColumns: 6, required: true, optionsService: this.aprovadoresComboFilter },
    { property: 'limite', label: 'Limite', gridColumns: 6, required: true, type: 'currency', format: 'BRL' },
  ];

  readonly columns: PoTableColumn[] = [
    { property: 'sequencia', label: 'Seq', type: 'string', width: '100px' },
    { property: 'codigo', label: 'Aprovador', type: 'string', width: '200px' },
    { property: 'limite', label: 'Limite', type: 'currency', format: 'BRL', width: '180px' },
  ];
  readonly actions: PoPageAction[] = [
    { label: 'Salvar', kind: 'primary', action: () => { this.salvarRegistro(); this.router.navigate(['/hierarquias/']) }, icon: 'po-icon-plus' },
    { label: 'Cancelar', action: () => this.router.navigate(['/hierarquias/']), icon: 'po-icon-plus', kind: 'primary' },
  ];

  readonly tableActions: PoTableAction[] = [
    { label: 'Editar', action: (item: Hierarquias) => this.openModal(item) },
    { label: 'Excluir', action: (item: Hierarquias) => this.confirmDelete(item) }
  ];

  readonly actionSave: PoModalAction = {
    action:()=> this.salvarHierarquia(),
    label:"Salvar",
  }
  readonly actionCancel: PoModalAction = {
    action:()=> this.closeModal(),
    label:"Cancelar",
  }

  hierarquiaSelecionada: Hierarquias = { 
    codigo:'',
    sequencia:'',
    limite:0
  };

  item: HierarquiaGroup = {
    estabelecimento: '',
    lotacao: '',
    tipoDocumento: '',
    Hierarquias:[],
  };

  estabelecimento: string | null = null;
  lotacao: string | null = null;
  tipoDocumento: string | null = null;
  sequencia: string | null = null;

  get modoEdicao(): boolean {
    return !!this.estabelecimento;
  }

  inserirAprovador() :void {
    
    this.openModal();
  }
  onLoadFields(): void {
    this.estabelecimento = this.route.snapshot.paramMap.get('estabelecimento');
    this.lotacao = this.route.snapshot.paramMap.get('lotacao');
    this.tipoDocumento = this.route.snapshot.paramMap.get('tipoDocumento');
    this.sequencia = this.route.snapshot.paramMap.get('sequencia');
    this.isEditing = true;
    
    if (!this.estabelecimento) {
      this.item = {
        estabelecimento: '',
        lotacao: '',
        tipoDocumento: '',
        Hierarquias: []
      };
      this.isEditing = false;
      return;
    }
    for (const field of this.fields) {
      const camposDesabilitados = ['estabelecimento', 'lotacao', 'tipoDocumento' ];
      if (camposDesabilitados.includes(field.property)) field.disabled = this.isEditing;
    }

    let params:{
      estabelecimento?:string,
      lotacao?:string,
      tipoDocumento?:string,
      sequencia?:string
    } = {};
    if (this.estabelecimento) params.estabelecimento = this.estabelecimento;
    if (this.lotacao) params.lotacao = this.lotacao;
    if (this.tipoDocumento) params.tipoDocumento = this.tipoDocumento;
    if (this.sequencia) params.sequencia = this.sequencia;
    console.log('loadFields');
    //const params = {estabelecimento:this.estabelecimento, lotacao:this.lotacao, tipoDocumento:this.tipoDocumento, sequencia:this.sequencia};
    this.hierarquiasService.getByFilter(params).subscribe({
      next: (hierarquia) => {
         this.item = {
          estabelecimento: hierarquia.items[0].estabelecimento ?? '',
          lotacao: hierarquia.items[0].lotacao ?? '',
          tipoDocumento: hierarquia.items[0].tipoDocumento ?? '',
          Hierarquias: hierarquia.items[0].Hierarquias ?? [],
        };
      },
      error: () => {
        this.notification.error('Não foi possível carregar o registro para edição.');
      },
    });
  }
  onChangeFields(changedValue: PoDynamicFormFieldChanged): PoDynamicFormValidation {
    return {
      value: changedValue.value,
      fields: [
        { property: 'codigo', label: 'Aprovador', gridColumns: 6, required: true, },
        { property: 'limite', label: 'Limite', gridColumns: 6, required: true, type: 'currency', format: 'BRL' },
      ],
    };
  }

  onLoadEditFields(): void {
  }
  onChangeEditFields(changedValue: PoDynamicFormFieldChanged): PoDynamicFormValidation {
    if (changedValue.property === 'codigo') {
      this.validaAprovador(changedValue.value['codigo']);
    }
    return {
      value: changedValue.value,
      fields: [],
    };
  }
  validaAprovador(aprovador:string){
    this.aprovadoresService.getById(aprovador).pipe();
    console.log('valida:' , aprovador);
  }
  openModal(item?: Hierarquias): void {
    this.isEditingHierarquia = !!item?.codigo;
    console.log(this.isEditingHierarquia);

    this.hierarquiaSelecionada = item ? { ...item } : {
      'codigo': '',
      'sequencia': (+this.item.Hierarquias.length + 1).toString(),
      'limite': 0
    };
    this.editarHierarquiaModal.open();
  }
  closeModal():void {
    this.editarHierarquiaModal.close();
  }
  confirmDelete(item: Hierarquias): void {
    this.dialogService.confirm({
      title: 'Excluir registro',
      message: `Deseja realmente excluir o usuário ${item['cod-usuario']}?`,
      confirm: () => this.deleteItem(item)
    });
  }
  deleteItem(item:Hierarquias){

  }
  salvarHierarquia(): void{
    
    if (this.item.Hierarquias.find(hierarquia => hierarquia.sequencia === this.hierarquiaSelecionada.sequencia)){
      
      console.log('alterar');
      this.item.Hierarquias = this.item.Hierarquias.map(hierarquia => {
        console.log('Existente:', hierarquia.sequencia);
        console.log(this.hierarquiaSelecionada.sequencia);
        if (hierarquia.sequencia === this.hierarquiaSelecionada.sequencia) return this.hierarquiaSelecionada
        else return hierarquia 
        
      });
    }else {
      if (this.item.Hierarquias.find(hierarquia => hierarquia.codigo === this.hierarquiaSelecionada.codigo )){
        this.notification.error( {message:'Já existe hierarquia com este aprovador', duration:2000});
        return;
      }
      this.item = {
        ...this.item,
        Hierarquias: [...this.item.Hierarquias, this.hierarquiaSelecionada]
      };
    }
    console.log(JSON.stringify(this.item.Hierarquias));
    
    this.closeModal();
    
    this.notification.success( {message:'Hierarquia incluída com sucesso', duration:2000});
  }
   deleteItems(items: Array<any>) {
    this.item.Hierarquias = items;
  }
  salvarRegistro(): void {
    const payload = {...this.item};
    console.log(JSON.stringify(payload));
 /*   const payload = { ...this.item };
    const request$ = this.itemId
      ? this.hierarquiasService.update(this.itemId, payload)
      : this.hierarquiasService.create(payload);

    request$.subscribe({
      next: () => {
        this.notification.success(this.itemId ? 'Registro atualizado com sucesso!' : 'Registro inserido com sucesso!');
        this.router.navigate(['/hierarquias']);
      },
      error: () => {
        this.notification.error('Não foi possível salvar o registro.');
      },
    });*/
  }
  cancelar(): void {
    this.router.navigate(['/hierarquias']);
  }
}
/*function hierarquia(value: PagedResult<Hierarquias>): void {
  throw new Error('Function not implemented.');
}*/

