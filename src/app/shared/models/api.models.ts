export interface PagedResult<T> {
  total: number;
  hasNext: boolean;
  items: T[];
}