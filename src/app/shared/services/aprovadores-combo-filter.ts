import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { PoComboFilter, PoComboOption } from '@po-ui/ng-components';
import { AprovadoresService } from '../../features/aprovadores/services/aprovadores.service';


@Injectable({ providedIn: 'root' })
export class AprovadoresComboFilter implements PoComboFilter {

  constructor(private aprovadoresService: AprovadoresService) {}

  getFilteredData(params: any, filterParams: any): Observable<Array<PoComboOption>> {

    return this.aprovadoresService.getAll().pipe(
      map(aprovadores => {
        const item = 
        aprovadores.items.map(a => 
          {
            if (a.nome.toLocaleLowerCase().includes(params.value.toLocaleLowerCase())) {
              return {
                label: a?.nome ?? '',   // o que aparece na lista
                value: a?.codigo ?? ''  // o que fica no ngModel
              }
            }
            return { label:'', value:''};
          })
      return item;          
      })
    );
  }

  getObjectByValue(value: any, filterParams: any): Observable<PoComboOption> {
    return this.aprovadoresService.getById(value).pipe(
      map(aprovadores => {
        const encontrado = aprovadores;
        return { label: encontrado?.nome ?? '', value: encontrado?.codigo ?? '' }  ;
      })
    );
  }
}