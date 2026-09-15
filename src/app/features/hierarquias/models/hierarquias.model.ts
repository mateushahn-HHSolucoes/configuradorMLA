export interface Hierarquias {
  sequencia:string;
  codigo:string;
  limite:number;
  [key:string]:unknown;
}

export interface HierarquiaGroup {
  estabelecimento:string;
  tipoDocumento:string;
  lotacao:string;
  Hierarquias:Hierarquias[];
  [key:string]:unknown;
}