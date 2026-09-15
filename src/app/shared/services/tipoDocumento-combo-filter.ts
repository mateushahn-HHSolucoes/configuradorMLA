import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { PoComboFilter, PoComboOption } from '@po-ui/ng-components';
import { MlaService } from './mla.service';


@Injectable({ providedIn: 'root' })
export class TipoDocumentoComboFilter implements PoComboFilter {

  constructor(private mlaService: MlaService) {}

  getFilteredData(params: any, filterParams: any): Observable<Array<PoComboOption>> {

    return this.mlaService.getAllTipoDocumento().pipe(
      map(tiposDocumento => {
        const item = 
        tiposDocumento.items.map(a => 
          {
            if (a.descricao.toLocaleLowerCase().includes(params.value.toLocaleLowerCase()) || a.codigo.toLocaleLowerCase().includes(params.value.toLocaleLowerCase())) {
              return {
                label: `${a?.codigo}-${a?.descricao}` ,   
                value: a?.codigo ?? ''  
              }
            }
            return { label:'', value:''};
          })
      return item;          
      })
    );
  }
  
  getObjectByValue(value: any, filterParams: any): Observable<PoComboOption> {
    return this.mlaService.getTipoDocumentoById(value).pipe(
      map(tiposDocumento => {
        var label:string = "";
        var value:string = "";
        if (tiposDocumento.codigo !== "" ) {
          label  = `${tiposDocumento.codigo}-${tiposDocumento.descricao}`;
          value = tiposDocumento.codigo;
        }
        return { label , value }  ;
      })
    );
  }
}