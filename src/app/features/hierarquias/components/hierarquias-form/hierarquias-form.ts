import { Component, ViewChild, inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  PoButtonModule,
  PoDynamicFormComponent,
  PoDynamicFormField,
  PoDynamicFormFieldChanged,
  PoDynamicFormValidation,
  PoDynamicModule,
  PoHeaderModule,
  PoNotificationService,
  PoPageModule,
} from '@po-ui/ng-components';

import { Hierarquias } from '../../models/hierarquias.model';
import { HierarquiasService } from '../../services/hierarquias.service';

@Component({
  selector: 'app-hierarquias-form',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    PoDynamicModule,
    PoPageModule,
    PoButtonModule,
    PoHeaderModule,
  ],
  templateUrl: './hierarquias-form.html',
  styleUrl: './hierarquias-form.css',
})
export class HierarquiasForm {
  private readonly hierarquiasService = inject(HierarquiasService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly notification = inject(PoNotificationService);

  @ViewChild('dynamicForm', { static: true }) dynamicForm?: PoDynamicFormComponent;

  readonly fields: Array<PoDynamicFormField> = [
    { property: 'estabelecimento', label: 'Estabelecimento', gridColumns: 6, required: true },
    { property: 'lotacao', label: 'Lotação', gridColumns: 6, required: true },
    { property: 'tipoDocumento', label: 'Tipo Documento', gridColumns: 6, required: true },
    { property: 'sequencia', label: 'Sequência', gridColumns: 3, required: true },
    { property: 'codigo', label: 'Aprovador', gridColumns: 3, required: true },
    { property: 'limite', label: 'Limite', gridColumns: 6, type: 'currency', required: true },
  ];

  item: Hierarquias = {
    estabelecimento: '',
    lotacao: '',
    tipoDocumento: '',
    sequencia: '',
    codigo: '',
    limite: 0,
  };

  estabelecimento: string | null = null;
  lotacao: string | null = null;
  tipoDocumento: string | null = null;
  sequencia: string | null = null;


  get modoEdicao(): boolean {
    return !!this.estabelecimento;
  }

  onLoadFields(): void {
    this.estabelecimento = this.route.snapshot.paramMap.get('estabelecimento');
    this.lotacao = this.route.snapshot.paramMap.get('lotacao');
    this.tipoDocumento = this.route.snapshot.paramMap.get('tipoDocumento');
    this.sequencia = this.route.snapshot.paramMap.get('sequencia');

    if (!this.estabelecimento) {
      this.item = {
        estabelecimento: '',
        lotacao: '',
        tipoDocumento: '',
        sequencia: '',
        codigo: '',
        limite: 0,
      };
      return;
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
    //const params = {estabelecimento:this.estabelecimento, lotacao:this.lotacao, tipoDocumento:this.tipoDocumento, sequencia:this.sequencia};
    this.hierarquiasService.getByFilter(params).subscribe({
      next: (hierarquia) => {
         this.item = {
          estabelecimento: hierarquia.items[0].estabelecimento ?? '',
          lotacao: hierarquia.items[0].lotacao ?? '',
          tipoDocumento: hierarquia.items[0].tipoDocumento ?? '',
          sequencia: hierarquia.items[0].sequencia ?? '',
          codigo: hierarquia.items[0].codigo ?? '',
          limite: Number(hierarquia.items[0].limite ?? 0),
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
      fields: [],
    };
  }

  salvar(): void {
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

