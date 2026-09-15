import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { PoComboFilter, PoComboOption } from '@po-ui/ng-components';
import { MlaService } from './mla.service';


@Injectable({ providedIn: 'root' })
export class EstabelecimentoComboFilter implements PoComboFilter {

  constructor(private mlaService: MlaService) {}

  getFilteredData(params: any, filterParams: any): Observable<Array<PoComboOption>> {

    return this.mlaService.getAllEstabelecimento().pipe(
      map(estabelecimentos => {
        const item = 
        estabelecimentos.items.map(a => 
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
    return this.mlaService.getEstabelecimentoById(value).pipe(
      map(estabelecimentos => {
        var label:string = "";
        var value:string = "";
        if (estabelecimentos.codigo !== "" ) {
          label  = `${estabelecimentos.codigo}-${estabelecimentos.descricao}`;
          value = estabelecimentos.codigo;
        }
        return { label , value }  ;
      })
    );
  }
}