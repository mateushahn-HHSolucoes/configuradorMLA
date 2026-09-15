import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { PoComboFilter, PoComboOption } from '@po-ui/ng-components';
import { MlaService } from './mla.service';


@Injectable({ providedIn: 'root' })
export class LotacaoComboFilter implements PoComboFilter {

  constructor(private mlaService: MlaService) {}

  getFilteredData(params: any, filterParams: any): Observable<Array<PoComboOption>> {

    return this.mlaService.getAllLotacao().pipe(
      map(lotacoes => {
        const item = 
        lotacoes.items.map(a => 
          {
            if (a.descricao.toLocaleLowerCase().includes(params.value.toLocaleLowerCase()) || a.codigo.toLocaleLowerCase().includes(params.value.toLocaleLowerCase())) {
              return {
                label: `${a?.codigo}-${a?.descricao}` ,   // o que aparece na lista
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
    return this.mlaService.getLotacaoById(value).pipe(
      map(lotacoes => {
        var label:string = "";
        var value:string = "";
        if (lotacoes.codigo !== "" ) {
          label  = `${lotacoes.codigo}-${lotacoes.descricao}`;
          value = lotacoes.codigo;
        }
        return { label , value }  ;
      })
    );
  }
}