import { TemplateRef } from '@angular/core';

export interface Column {
  field: string;
  header: string;
  cellRenderer?: (data: any) => any;
  cellTemplate?: TemplateRef<any>;
  sortable?: boolean;
  filterable?: boolean;
  filterType?: 'text' | 'numeric' | 'date' | 'custom';
  customFilterTemplate?: TemplateRef<any>;
  onClick?: (row: any) => void;
}

export interface Paging {
  // Deprecated: kept for backward compatibility
  page: number;
  size: number;
  sortBy?: string;
  sortDir?: string;
  filter?: string;
}

export interface CommonResponseModel<T> {
  data: T;
  message: string;
  status: number;
}

export interface PagingMaster<T> {
  // New JPA Page<T> like structure
  content: T[];
  pageable: Pageable;
  last: boolean;
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
  sort: Sort;
  first: boolean;
  numberOfElements: number;
  empty: boolean;
  // optional message
  message?: string;
}

export interface Sort {
  empty: boolean;
  unsorted: boolean;
  sorted: boolean;
}

export interface Pageable {
  pageNumber: number;
  pageSize: number;
  sort: Sort;
  offset: number;
  unpaged: boolean;
  paged: boolean;
}

export interface Enum {
  label: string;
  value: string | number;
}

export interface FileChangeModel {
  files: File[];
  action: 'add' | 'remove';
  removedIndex?: number;
}
