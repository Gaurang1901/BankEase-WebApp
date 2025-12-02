import { Component, inject, TemplateRef, ViewChild } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { TableComponent } from '../../../../../../components/table/table.component';
import { Column, Paging } from '../../../../../../core/types/helper.model';
import { Router } from '@angular/router';
import { MasterService } from '../../../services/master.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { StateModel } from '../../models/state.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-state-list',
  imports: [ButtonModule, TableComponent],
  templateUrl: './state-list.component.html',
  styleUrl: './state-list.component.css',
})
export class StateListComponent {
  columns: Column[] = [];
  paging: Paging = {
    page: 1,
    size: 10,
  };

  @ViewChild('actionTemplate') actionTemplate!: TemplateRef<any>;

  router = inject(Router);
  masterService = inject(MasterService);
  confirmationService = inject(ConfirmationService);
  messageService = inject(MessageService);

  ngOnInit(): void {
    this.columns = [
      {
        field: 'name',
        header: 'Name',
      },
      {
        field: 'code',
        header: 'Code',
      },
      {
        field: 'countryName',
        header: 'Country',
      },
    ];
  }

  ngAfterViewInit(): void {
    this.columns.push({
      field: 'actions',
      header: 'Actions',
      cellTemplate: this.actionTemplate,
    });
  }

  getDataFunc(data: Paging, component: StateListComponent): Observable<any> {
    return component.masterService.getAllStates(data);
  }

  onAddState() {
    this.router.navigate(['admin/state-add']);
  }

  navigateToUpdate(data: StateModel) {
    this.router.navigate(['admin/state-add'], { state: { data } });
  }

  deleteState(data: StateModel) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this state?',
      header: 'Delete State',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.masterService.deleteState(data.id!).subscribe({
          next: () => {
            this.router.navigate(['admin/state-list']);
          },
          error: (err) => {
            this.messageService.add({
              key: 'custom-toast',
              severity: 'error',
              summary: 'Error',
              detail: err.message,
            });
          },
        });
      },
      reject: () => {
        this.messageService.add({
          key: 'custom-toast',
          severity: 'info',
          summary: 'Info',
          detail: 'You have cancelled the action',
        });
      },
    });
  }
}
