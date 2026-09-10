import { Component, inject, ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PoHeaderModule, PoNotificationService, PoButtonModule,  PoDynamicModule, PoDynamicFormField, PoDynamicFormFieldChanged, PoDynamicFormValidation, PoDynamicFormComponent, PoPageModule } from '@po-ui/ng-components';
import {AprovadoresService} from '../../services/aprovadores.service';
import { Router, ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-aprovadores-form',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, PoDynamicModule, PoPageModule, PoButtonModule, PoHeaderModule],
  templateUrl: './aprovadores-form.html',
  styleUrl: './aprovadores-form.css',
})
export class AprovadoresForm {
  
  fields: Array<PoDynamicFormField> = [
    { property: 'codigo', label: 'Usuario', gridColumns: 12, required: true },
    { property: 'nome', label: 'Nome', gridColumns: 12, required: true },
    { property: 'cargo', label: 'Cargo', gridColumns: 12, required: true },
    { property: 'lotacao', label: 'Lotação', gridColumns: 12, required: true },
    { property: 'estabelecimento', label: 'Estabelecimento', gridColumns: 12, required: true }
  ];
  private aprovadoresService = inject(AprovadoresService);
  private router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  poNotification = inject(PoNotificationService);

  validateFields: Array<string> = ['state'];

  @ViewChild('dynamicForm', { static: true }) dynamicForm?: PoDynamicFormComponent;



  aprovador:{} = {};

  aprovadorId: string | null = null;

  get modoEdicao(): boolean {
    return !!this.aprovadorId;
  }

  getData(): any {
  }
  onLoadFields(value: any) {
    this.route.paramMap.subscribe((params) => { 
      this.aprovadorId = params.get('id');
     
      if (!this.aprovadorId) return;
      
      this.aprovadoresService.getById(this.aprovadorId).subscribe({
        next: (aprovador) => {
          this.aprovador = aprovador;
        }
      });
    });  
  }

  onChangeFields(changedValue: PoDynamicFormFieldChanged): PoDynamicFormValidation {
    return {
      value: { city: undefined },
      fields: [
        {
          property: 'city',
          gridColumns: 6,
          disabled: false,
          loading: true
        }
      ]
    };
  }
  
  cancelar(): void {
    this.router.navigate(['/aprovadores']);
  }
}

