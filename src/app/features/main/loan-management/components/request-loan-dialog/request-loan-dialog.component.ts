import { Component, inject, input, output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import {
  LOAN_TYPES,
  LoanInterestRateModel,
  ApplyLoanRequestModel,
} from '../../models/loan.model';
import { LoanService } from '../../service/loan.service';
import { AuthService } from '../../../../../core/auth/services/auth.service';
import { MessageService } from 'primeng/api';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';

@Component({
  selector: 'app-request-loan-dialog',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DialogModule,
    ButtonModule,
    DropdownModule,
    InputTextModule,
    InputNumberModule,
  ],
  templateUrl: './request-loan-dialog.component.html',
  styleUrl: './request-loan-dialog.component.css',
})
export class RequestLoanDialogComponent implements OnInit {
  visible = input.required<boolean>();
  visibleChange = output<{ visible: boolean; type: 'submit' | 'cancel' }>();

  private fb = inject(FormBuilder);
  private loanService = inject(LoanService);
  private authService = inject(AuthService);
  private messageService = inject(MessageService);

  requestLoanForm!: FormGroup;
  isSubmitting = false;
  isLoadingRates = false;
  userId: string = '';
  interestRates: LoanInterestRateModel[] = [];

  loanTypeOptions = [
    { label: 'Home Loan', value: 'HOME' },
    { label: 'Personal Loan', value: 'PERSONAL' },
    { label: 'Vehicle Loan', value: 'VEHICLE' },
    { label: 'Student Loan', value: 'STUDENT' },
    { label: 'Business Loan', value: 'BUSINESS' },
  ];

  // Mock account numbers - replace with actual data from API

  ngOnInit() {
    this.initializeForm();
    this.loadInterestRates();

    // Get user ID
    this.authService.getUserProfile().subscribe((user) => {
      if (user) {
        this.userId = user.userId!;
        this.requestLoanForm.patchValue({ userId: user.userId });
        this.requestLoanForm.patchValue({ accountNumber: user.accountNumber });
      }
    });
  }

  initializeForm() {
    this.requestLoanForm = this.fb.group({
      userId: ['', Validators.required],
      loanType: ['', Validators.required],
      principalAmount: [0, [Validators.required, Validators.min(1)]],
      interestRate: [{ value: 0, disabled: true }],
      totalMonths: [
        0,
        [Validators.required, Validators.min(1), Validators.max(360)],
      ],
      accountNumber: ['', Validators.required],
    });

    // Subscribe to loan type changes to auto-populate interest rate
    this.requestLoanForm
      .get('loanType')
      ?.valueChanges.subscribe((loanType: LOAN_TYPES) => {
        this.updateInterestRate(loanType);
      });
  }

  loadInterestRates() {
    this.isLoadingRates = true;
    this.loanService.getLoanInterestRates().subscribe({
      next: (response) => {
        this.interestRates = response.data;
        this.isLoadingRates = false;
      },
      error: (err) => {
        console.error('Failed to load interest rates', err);
        this.messageService.add({
          key: 'custom-toast',
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load interest rates. Please try again.',
        });
        this.isLoadingRates = false;
      },
    });
  }

  updateInterestRate(loanType: LOAN_TYPES) {
    const rate = this.interestRates.find((r) => r.loanTypes === loanType);
    if (rate) {
      this.requestLoanForm.patchValue({ interestRate: rate.interestRate });
    }
  }

  onSubmit() {
    if (this.requestLoanForm.invalid) {
      this.markFormGroupTouched(this.requestLoanForm);
      return;
    }

    this.isSubmitting = true;

    const payload: ApplyLoanRequestModel = this.requestLoanForm.getRawValue();

    this.loanService.applyForLoan(payload, this.userId).subscribe({
      next: (response) => {
        this.messageService.add({
          key: 'custom-toast',
          severity: 'success',
          summary: 'Loan Applied',
          detail: 'Your loan application has been submitted successfully.',
        });
        this.isSubmitting = false;
        this.closeDialog('submit');
      },
      error: (err) => {
        console.error('Failed to apply for loan', err);
        this.messageService.add({
          key: 'custom-toast',
          severity: 'error',
          summary: 'Application Failed',
          detail: 'Failed to submit loan application. Please try again.',
        });
        this.isSubmitting = false;
      },
    });
  }

  closeDialog(type: 'submit' | 'cancel' = 'cancel') {
    this.requestLoanForm.reset();
    this.visibleChange.emit({ visible: false, type });
  }

  private markFormGroupTouched(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach((key) => {
      const control = formGroup.get(key);
      control?.markAsTouched();
    });
  }

  hasError(fieldName: string): boolean {
    const field = this.requestLoanForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getErrorMessage(fieldName: string): string {
    const field = this.requestLoanForm.get(fieldName);
    if (field?.hasError('required')) {
      return 'This field is required';
    }
    if (field?.hasError('min')) {
      return 'Value must be greater than 0';
    }
    if (field?.hasError('max')) {
      return 'Maximum tenure is 360 months (30 years)';
    }
    return '';
  }
}
