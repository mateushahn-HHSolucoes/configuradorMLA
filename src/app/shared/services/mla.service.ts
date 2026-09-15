import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';


import { HttpClient } from '@angular/common/http';
import { Estabelecimento, Lotacao, TipoDocumento } from '../models/mla.models';
import { PagedResult } from '../models/api.models';

const STORAGE_KEY = 'aprovadores-list';

@Injectable({ providedIn: 'root' })
export class MlaService {

  constructor(private http: HttpClient){}

  private readonly urlApi = 'https://circulooperario192206.datasul.cloudtotvs.com.br/api/rest/v1/apiMLA/';

  getAllEstabelecimento(): Observable<PagedResult<Estabelecimento>> {
    return this.http.get<PagedResult<Estabelecimento>>(`${this.urlApi}estabelecimentos`, {headers: {'Authorization': 'Basic YXBwOkMzRE5JQmpVaHVTVg=='} });
  }

  getEstabelecimentoById(id: string | null): Observable<Estabelecimento> {
    if (!id) {
      return of({ codigo: '', descricao: ''});
    }
    return this.http.get<Estabelecimento>(`${this.urlApi}estabelecimentos/${id}`, {headers: {'Authorization': 'Basic YXBwOkMzRE5JQmpVaHVTVg=='} });
  }

  getAllLotacao(): Observable<PagedResult<Lotacao>> {
    return this.http.get<PagedResult<Lotacao>>(`${this.urlApi}lotacoes`, {headers: {'Authorization': 'Basic YXBwOkMzRE5JQmpVaHVTVg=='} });
  }

  getLotacaoById(id: string | null): Observable<Lotacao> {
    if (!id) {
      return of({ codigo: '', descricao: ''});
    }
    return this.http.get<Lotacao>(`${this.urlApi}lotacoes/${id}`, {headers: {'Authorization': 'Basic YXBwOkMzRE5JQmpVaHVTVg=='} });
  }
  getAllTipoDocumento(): Observable<PagedResult<TipoDocumento>> {
    return this.http.get<PagedResult<TipoDocumento>>(`${this.urlApi}tiposDocumento`, {headers: {'Authorization': 'Basic YXBwOkMzRE5JQmpVaHVTVg=='} });
  }

  getTipoDocumentoById(id: string | null): Observable<TipoDocumento> {
    if (!id) {
      return of({ codigo: '', descricao: ''});
    }
    return this.http.get<TipoDocumento>(`${this.urlApi}tiposDocumento/${id}`, {headers: {'Authorization': 'Basic YXBwOkMzRE5JQmpVaHVTVg=='} });
  }

}
