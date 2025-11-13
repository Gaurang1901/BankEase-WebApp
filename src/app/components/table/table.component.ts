import {
  ChangeDetectorRef,
  Component,
  ContentChild,
  inject,
  Input,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import {
  catchError,
  map,
  Observable,
  Subject,
  takeUntil,
  throwError,
} from 'rxjs';
import { Table, TableModule, TableService } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { FilterService, MessageService } from 'primeng/api';
import {
  Column,
  CommonResponseModel,
  Paging,
  PagingMaster,
} from '../../core/types/helper.model';
import { normalizeDate } from '../../core/utils/helper.functions';
import { Button } from 'primeng/button';
import { ApiService } from '../../core/auth/services/api.service';
import { HttpHeaders } from '@angular/common/http';
import FileSaver from 'file-saver';
import { CustomTableService } from '../../core/services/table.service';

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [CommonModule, TableModule, Button],
  templateUrl: './table.component.html',
  styleUrl: './table.component.css',
  providers: [TableService, FilterService],
})
export class TableComponent {
  @Input({ required: true }) columns: Column[] = [];
  @Input({ required: true }) getDataFunc!: (
    data: Paging,
    componentInstance?: any
  ) => Observable<CommonResponseModel<PagingMaster<any>>>;
  @Input() componentInstance?: any;
  @Input() totalItems = 0;
  @Input() paginationPageSize = 10;
  @Input() customFilters: Record<string, any> = {};
  @Input() showExportToExcel = false;

  @ContentChild('customFilterTemplate') customFilterTemplate!: TemplateRef<any>;

  @ViewChild(Table) dataTable!: Table;
  data: any[] = [];
  loading = false;
  currentPageRows: any[] = [];
  rowsPerPageOptions = [5, 10, 50, 100, 200];
  sortField: string | null = null;
  sortOrder: number | null = null;
  rowsForTable = 10;
  @Input() exportUrl!: string;
  apiService: ApiService = inject(ApiService);

  private _destroy$ = new Subject<void>();
  previousFilter: string | undefined;

  // totalItems = 100; // fetched from backend
  // rowsForTable = 10; // page size
  currentPage = 1;

  constructor(
    private cd: ChangeDetectorRef,
    private messageService: MessageService,
    private sanitizer: DomSanitizer,
    private _tableService: CustomTableService
  ) {}

  ngOnInit(): void {
    this._tableService.refreshTable$
      .pipe(takeUntil(this._destroy$))
      .subscribe((refreshTable) => {
        if (refreshTable) {
          const currentState = {
            first: this.dataTable.first || 0,
            rows: this.dataTable.rows,
            sortField: this.sortField,
            sortOrder: this.sortOrder,
            filters: this.dataTable.filters,
          };
          this.loadData(currentState);
          this._tableService.setrefreshTable(false);
        }
      });
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

  get totalPages(): number {
    return Math.ceil(this.totalItems / this.rowsForTable);
  }

  loadData(event: any): void {
    this.data = [];
    this.loading = true;
    this.cd.detectChanges();

    const rows = event.rows ?? this.paginationPageSize;
    this.currentPage = event.first / event.rows + 1;

    if (event.rows && event.rows !== this.rowsForTable) {
      Promise.resolve().then(() => (this.rowsForTable = event.rows));
    }

    this.sortField = event.sortField ?? this.sortField;
    this.sortOrder = event.sortOrder ?? this.sortOrder;

    const requestParams: Paging = {
      page: this.currentPage - 1,
      size: this.currentPage,
    };
    sortBy: this.getSortQuery(this.sortField, this.sortOrder),
      this.getDataFunc(requestParams, this.componentInstance).subscribe({
        next: (res) => {
          this.data = res.data.content ?? [];
          this.totalItems = res.data.totalElements ?? 0;
          this.currentPageRows = this.data;
          this.loading = false;
        },
        error: (err: any) => {
          this.loading = false;
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: err.error?.message ?? 'Failed to load data',
          });
        },
      });
  }

  private getSortQuery(
    sortField: string | null,
    sortOrder: number | null
  ): string {
    if (!sortField || sortOrder == null) return '';
    return `${sortField} ${sortOrder === 1 ? 'asc' : 'desc'}`;
  }

  renderCell(col: Column, rowData: any): SafeHtml {
    try {
      const html: unknown = col.cellRenderer ? col.cellRenderer(rowData) : '';
      return this.sanitizer.bypassSecurityTrustHtml(String(html ?? ''));
    } catch {
      return '';
    }
  }

  handleCellClick(col: Column, rowData: any): void {
    if (typeof col.onClick === 'function') {
      col.onClick(rowData);
    }
  }

  renderCustomFilter(col: Column): TemplateRef<any> | null {
    return col.customFilterTemplate || this.customFilterTemplate || null;
  }
  onExport(): void {
    if (this.showExportToExcel && this.exportUrl?.length > 0) {
      const headers = new HttpHeaders().set(
        'Accept',
        'application/octet-stream'
      );

      // Prepare query params with previous filter and exportToExcel flag
      const params: any = {};
      if (this.previousFilter) {
        params['filter'] = this.previousFilter;
      }
      params['exportToExcel'] = true;
      this.loading = true;

      this.apiService
        .get(this.exportUrl, {
          params,
          headers,
          responseType: 'blob',
        } as any)
        .pipe(
          map((data: any) => {
            if (data) {
              const newFileName = `Data ${new Date()
                .toISOString()
                .slice(0, 10)}.xlsx`;
              FileSaver.saveAs(data, newFileName);
              this.loading = false;
            }
            return data;
          }),
          catchError((error: any) => {
            this.loading = false;
            this.messageService.add({
              key: 'custom-toast',
              severity: 'error',
              summary: 'Error',
              detail: error?.error?.message ?? 'Failed to export data',
            });
            return throwError(() => error);
          })
        )
        .subscribe();
    }
  }

  goToPreviousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadPage();
    }
  }

  goToNextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.loadPage();
    }
  }

  loadPage() {
    const first = (this.currentPage - 1) * this.rowsForTable;
    const rows = this.rowsForTable;
    this.loadData({ first, rows });
  }
}
