import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

import {Aprovadores} from '../models/aprovadores.model';
import { HttpClient, HttpParams } from '@angular/common/http';
import { PagedResult } from '../../../shared/models/api.models';

const STORAGE_KEY = 'aprovadores-list';

@Injectable({ providedIn: 'root' })
export class AprovadoresService {

  constructor(private http: HttpClient){}

  private readonly urlApi = 'https://circulooperario192206.datasul.cloudtotvs.com.br/api/rest/v1/apiMLA/aprovadores';

  private readonly defaultItems: Aprovadores[] = [
    {'codigo': 'U001',nome: 'João',  cargo: 'Gerente', lotacao: 'Departamento A', estabelecimento: 'Estabelecimento X'},
    {'codigo': 'U002',nome: 'Maria', cargo: 'Coordenador', lotacao: 'Departamento B', estabelecimento: 'Estabelecimento Y'},
    {'codigo': 'U003',nome: 'Luiz',  cargo: 'Lider', lotacao: 'Departamento C', estabelecimento: 'Estabelecimento Z'}
  ];

  

  getAll(): Observable<PagedResult<Aprovadores>> {
    return this.http.get<PagedResult<Aprovadores>>(this.urlApi, {headers: {'Authorization': 'Basic YXBwOkMzRE5JQmpVaHVTVg=='} });
  }

  getById(id: string | null): Observable<Aprovadores> {
    if (!id) {
      return of({ codigo: '', nome: '', cargo: '', lotacao: '', estabelecimento: '' });
    }
    return this.http.get<Aprovadores>(`${this.urlApi}/${id}`, {headers: {'Authorization': 'Basic YXBwOkMzRE5JQmpVaHVTVg=='} });
  }

  create(item: Aprovadores): Observable<Aprovadores> {
    const newItem = { ...item, id: Date.now() };
    const list = [...this.readStorage() ?? this.defaultItems, newItem];
    this.persist(list);
    return of({ ...newItem });
  }

  update(id: string, item: Aprovadores): Observable<Aprovadores> {
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

  private readStorage(): Aprovadores[] | null {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as Aprovadores[]) : null;
    } catch {
      return null;
    }
  }

  private persist(items: Aprovadores[]): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }
}
