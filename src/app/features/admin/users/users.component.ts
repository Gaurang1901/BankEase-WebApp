import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TabViewModule } from 'primeng/tabview';
import { ButtonModule } from 'primeng/button';
import { TableComponent } from '../../../components/table/table.component';
import { UserService } from './services/user.service';
import {
  Column,
  CommonResponseModel,
  Paging,
  PagingMaster,
} from '../../../core/types/helper.model';
import { UserResponseModel } from './models/user.model';
import { Observable } from 'rxjs';
import { ApiService } from '../../../core/auth/services/api.service';
import { DialogModule } from 'primeng/dialog';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { CalendarModule } from 'primeng/calendar';
import { MessageService } from 'primeng/api';
import { CustomTableService } from '../../../core/services/table.service';
import { PasswordModule } from 'primeng/password';
import { DropdownModule } from 'primeng/dropdown';
import { InputGroupComponent } from '../../../components/input-group/input-group.component';
import { FormHelper } from '../../../core/utils/form.helper';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [
    CommonModule,
    TabViewModule,
    ButtonModule,
    TableComponent,
    DialogModule,
    ReactiveFormsModule,
    InputTextModule,
    CalendarModule,
    PasswordModule,
    DropdownModule,
    InputGroupComponent,
  ],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css',
  providers: [MessageService],
})
export class UsersComponent implements OnInit {
  userService = inject(UserService);
  activeIndex: number = 0;
  api = inject(ApiService);
  fb = inject(FormBuilder);
  messageService = inject(MessageService);
  tableService = inject(CustomTableService);
  formHelper = inject(FormHelper);

  visible: boolean = false;
  adminForm: FormGroup;
  states: any[] = [];

  errorMessages = {
    required: 'This field is required',
    email: 'Invalid email address',
    minlength: 'Password must be at least 8 characters',
  };

  constructor() {
    this.adminForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phoneNo: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(8)]],
      role: ['ROLE_ADMIN'],
      dateOfBirth: [null, Validators.required],
      address: this.fb.group({
        addressLine1: ['', Validators.required],
        addressLine2: [''],
        city: ['', Validators.required],
        stateId: ['', Validators.required],
        pinCode: ['', Validators.required],
        userId: [''],
      }),
    });
  }

  ngOnInit() {
    this.getStates();
  }

  getStates() {
    this.api.get('/api/state').subscribe({
      next: (response: any) => {
        this.states = response.content || response.data.content || [];
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to fetch states',
        });
      },
    });
  }

  showDialog() {
    this.visible = true;
    this.adminForm.reset({
      role: 'ROLE_ADMIN',
    });
  }

  getControl(
    controlName: string,
    formGroup: FormGroup = this.adminForm
  ): FormControl {
    return this.formHelper.getFormControl(formGroup, controlName);
  }

  getAddressControl(controlName: string): FormControl {
    return this.getControl(
      controlName,
      this.adminForm.get('address') as FormGroup
    );
  }

  onSubmit() {
    if (this.adminForm.valid) {
      const payload = {
        ...this.adminForm.value,
        role: 'ROLE_ADMIN',
      };

      if (payload.dateOfBirth instanceof Date) {
        payload.dateOfBirth = payload.dateOfBirth.toISOString().split('T')[0];
      }

      this.api.post('/api/auth/signup', payload).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Admin user created successfully',
          });
          this.visible = false;
          this.tableService.setrefreshTable(true);
        },
        error: (err) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: err.error?.message || 'Failed to create admin user',
          });
        },
      });
    } else {
      this.adminForm.markAllAsTouched();
    }
  }

  userColumns: Column[] = [
    { field: 'name', header: 'Name' },
    { field: 'email', header: 'Email' },
    {
      field: 'accountNumbers',
      header: 'Account No',
      cellRenderer: (data) => data?.accountNumbers?.join(', ') || 'N/A',
    },
    { field: 'phoneNo', header: 'Phone' },
    {
      field: 'address',
      header: 'Location',
      cellRenderer: (data) =>
        data.address
          ? `${data.address.city}, ${data.address.stateName}`
          : 'N/A',
    },
    { field: 'dateOfBirth', header: 'Joined Date' },
    // {
    //   field: 'actions',
    //   header: 'Actions',
    //   cellRenderer: () => '<i class="pi pi-eye cursor-pointer"></i>',
    // },
  ];

  adminColumns: Column[] = [...this.userColumns];

  getUsers = (
    paging: Paging,
    componentInstance: UsersComponent
  ): Observable<CommonResponseModel<PagingMaster<any>>> => {
    const params: any = {
      page: paging.page ?? 0,
      size: 10,
      sortBy: paging.sortBy ?? 'createdAt',
      sortDir: paging.sortDir ?? 'desc',
    };

    return componentInstance.api.get(`/api/user`, {
      params,
    } as any);
  };

  getAdminUsers = (
    paging: Paging,
    componentInstance: UsersComponent
  ): Observable<CommonResponseModel<PagingMaster<any>>> => {
    const params: any = {
      page: paging.page ?? 0,
      size: 10,
      sortBy: paging.sortBy ?? 'createdAt',
      sortDir: paging.sortDir ?? 'desc',
    };

    return componentInstance.api.get(`/api/user/admin`, {
      params,
    } as any);
  };

  onTabChange(event: any) {
    this.activeIndex = event.index;
  }
}
