import { Component, inject } from '@angular/core';
import { LoanInterestRateModel } from '../../models/loan-interest-rate.model';
import {
  FormGroup,
  FormControl,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { MessageService } from 'primeng/api';
import { FormHelper } from '../../../../../../core/utils/form.helper';
import { MasterService } from '../../../services/master.service';
import { Location } from '@angular/common';
import { InputGroupComponent } from '../../../../../../components/input-group/input-group.component';
import { InputNumberModule } from 'primeng/inputnumber';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { LOAN_TYPES } from '../../../../../../core/types/constants';

@Component({
  selector: 'app-loan-interest-rate-create',
  imports: [
    InputGroupComponent,
    InputNumberModule,
    ButtonModule,
    ReactiveFormsModule,
    SelectModule,
  ],
  templateUrl: './loan-interest-rate-create.component.html',
  styleUrl: './loan-interest-rate-create.component.css',
})
export class LoanInterestRateCreateComponent {
  stateForm!: FormGroup;
  stateData!: LoanInterestRateModel;

  masterService = inject(MasterService);
  messageService = inject(MessageService);
  location = inject(Location);
  formHelper = inject(FormHelper);
  loanTypes = Object.values(LOAN_TYPES);

  ngOnInit(): void {
    this.createForm();
    this.patchDataFromLocation();
  }

  createForm() {
    this.stateForm = new FormGroup({
      id: new FormControl(''),
      loanTypes: new FormControl('', [Validators.required]),
      interestRate: new FormControl('', [
        Validators.required,
        Validators.min(0),
        Validators.max(100),
      ]),
    });
  }

  patchDataFromLocation() {
    const locationData: any = this.location.getState() as LoanInterestRateModel;
    if (locationData.data) {
      this.stateData = locationData.data;
      this.stateForm.patchValue(locationData.data);
    }
  }

  onSubmit() {
    if (this.stateForm.valid) {
      const stateData = this.stateForm.value;
      if (this.stateData && this.stateData.id) {
        this.updateState(stateData);
      } else {
        this.createState(stateData);
      }
    } else {
      this.messageService.add({
        key: 'custom-toast',
        severity: 'error',
        summary: 'Error',
        detail: 'Please fill all the required fields',
      });
    }
  }

  createState(stateData: LoanInterestRateModel) {
    this.masterService.createLoanInterestRate(stateData).subscribe({
      next: () => {
        this.messageService.add({
          key: 'custom-toast',
          severity: 'success',
          summary: 'Success',
          detail: 'Loan Interest Rate created successfully',
        });
        this.location.back();
      },
      error: (err) => {
        this.messageService.add({
          key: 'custom-toast',
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to create Loan Interest Rate',
        });
      },
    });
  }

  updateState(stateData: LoanInterestRateModel) {
    this.masterService.updateLoanInterestRate(stateData).subscribe({
      next: () => {
        this.messageService.add({
          key: 'custom-toast',
          severity: 'success',
          summary: 'Success',
          detail: 'Loan Interest Rate updated successfully',
        });
        this.location.back();
      },
      error: (err) => {
        this.messageService.add({
          key: 'custom-toast',
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to update Loan Interest Rate',
        });
      },
    });
  }
}
