import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

import { Hierarquias } from '../models/hierarquias.model';
import { HttpClient } from '@angular/common/http';
import { PagedResult } from '../../../shared/models/api.models';
import {
   PoTableColumnSort,
   PoTableColumnSortType
  } from '@po-ui/ng-components';

const STORAGE_KEY = 'aprovadores-list';

@Injectable({ providedIn: 'root' })
export class HierarquiasService {

  constructor(private http: HttpClient){}

  items:Hierarquias[] = [];

  readonly defaultItems:Hierarquias[] = [];
  

  private readonly urlApi = 'https://circulooperario192206.datasul.cloudtotvs.com.br/api/rest/v1/apiMLA/hierarquias';

  getAll(params:any): Observable<PagedResult<Hierarquias>> {
    return this.http.get<PagedResult<Hierarquias>>(this.urlApi, {headers: {'Authorization': 'Basic YXBwOkMzRE5JQmpVaHVTVg=='}, params:params});
  }

  getByFilter(params:{estabelecimento?:string, lotacao?:string, tipoDocumento?:string, codigo?:string, sequencia?:string }): Observable<PagedResult<Hierarquias>> {
    console.log('getByFilter');
    return this.http.get<PagedResult<Hierarquias>>(this.urlApi, {headers: {'Authorization': 'Basic YXBwOkMzRE5JQmpVaHVTVg=='}, params:params });
  }

  create(item: Hierarquias): Observable<Hierarquias> {
    const newItem = { ...item, id: Date.now() };
    const list = [...this.readStorage() ?? this.defaultItems, newItem];
    this.persist(list);
    return of({ ...newItem });
  }

  update(id: string, item: Hierarquias): Observable<Hierarquias> {
    const list = (this.readStorage() ?? this.defaultItems).map(current =>
      current.codigo === id ? { ...item, id } : current
    );
    this.persist(list);
    return of({ ...item, id });
  }

  delete(id: string): Observable<void> {
    const list = (this.readStorage() ?? this.defaultItems).filter(item => item.codigo !== id);
    this.persist(list);
    return of(void 0);
  }

  private readStorage(): Hierarquias[] | null {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as Hierarquias[]) : null;
    } catch {
      return null;
    }
  }

  private persist(items: Hierarquias[]): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }
  private sort(value: any, valueToCompare: any, sort: PoTableColumnSort) {
    const property = sort.column?.property;
    const type = sort.type;

    if (!property) return -1;
    if (property.split('.').length > 1) {
      const propertySplitedFirst = property.split('.')[0];
      const propertySplitedLast = property.split('.')[1];
      if (
        value[propertySplitedFirst][propertySplitedLast] < valueToCompare[propertySplitedFirst][propertySplitedLast]
      ) {
        return type === PoTableColumnSortType.Ascending ? -1 : 1;
      }
      return type === PoTableColumnSortType.Ascending ? 1 : -1;
    } else {
      if (value[property] < valueToCompare[property]) {
        return type === PoTableColumnSortType.Ascending ? -1 : 1;
      }
      return type === PoTableColumnSortType.Ascending ? 1 : -1;
    }
  }
  
}
