import {
  Component,
  inject,
  input,
  output,
  effect,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { LoanModel, LOAN_UPDATE_TYPES } from '../../models/loan.model';
import { LoanService } from '../../service/loan.service';
import { AuthService } from '../../../../../core/auth/services/auth.service';
import { MessageService } from 'primeng/api';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextarea } from 'primeng/inputtextarea';
import { User } from '../../../../../core/auth/store/auth.state';
import { CalendarModule } from 'primeng/calendar';

@Component({
  selector: 'app-update-loan-dialog',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DialogModule,
    ButtonModule,
    DropdownModule,
    InputTextModule,
    InputNumberModule,
    InputTextarea,
    CalendarModule,
  ],
  templateUrl: './update-loan-dialog.component.html',
  styleUrl: './update-loan-dialog.component.css',
})
export class UpdateLoanDialogComponent {
  visible = input.required<boolean>();
  loan = input<LoanModel | null>(null);
  visibleChange = output<{ visible: boolean; type: 'submit' | 'cancel' }>();

  private fb = inject(FormBuilder);
  private loanService = inject(LoanService);
  private authService = inject(AuthService);
  private messageService = inject(MessageService);

  loanUpdateForm!: FormGroup;
  isSubmitting = false;
  userId: string = '';
  user: User | null = null;
  minDate: Date = new Date();
  maxDate: Date = new Date(
    new Date().setFullYear(new Date().getFullYear() + 2)
  );

  updateTypeOptions = [
    { label: 'Enhancement', value: 'Enhancement' },
    { label: 'Tenure Change', value: 'Tenure_Change' },
    { label: 'Repayment Method Change', value: 'Repayment_Method_Change' },
    { label: 'Part Prepayment', value: 'Part_prepayment' },
    { label: 'Restructuring', value: 'Restructuring' },
  ];

  constructor() {
    this.initializeForm();

    // Effect to populate form when loan changes
    effect(() => {
      const currentLoan = this.loan();
      if (currentLoan) {
        this.populateForm(currentLoan);
      }
    });

    // Get user ID
    this.authService.getUserProfile().subscribe((user) => {
      if (user) {
        this.userId = user.userId!;
        this.user = user;
      }
    });
  }

  initializeForm() {
    this.loanUpdateForm = this.fb.group({
      userId: ['', Validators.required],
      loanType: [{ value: '', disabled: true }],
      principalAmount: [{ value: 0, disabled: true }],
      interestRate: [{ value: 0, disabled: true }],
      totalMonths: [{ value: 0, disabled: true }],
      accountNumber: [{ value: '', disabled: true }],
      description: [''],
      updateType: ['', Validators.required],
      prePaymentAmount: [{ value: 0, disabled: true }],
      loanDate: [null],
    });

    // Subscribe to update type changes
    this.loanUpdateForm
      .get('updateType')
      ?.valueChanges.subscribe((updateType) => {
        this.onUpdateTypeChange(updateType);
      });
  }

  populateForm(loan: LoanModel) {
    this.loanUpdateForm.patchValue({
      userId: loan.userId,
      loanType: loan.loanType,
      principalAmount: loan.principalAmount,
      interestRate: loan.interestRate,
      totalMonths: loan.totalMonths,
      accountNumber: loan.accountNumber ?? this.user?.accountNumber,
      description: '',
      updateType: '',
      prePaymentAmount: 0,
    });

    // Reset all fields to disabled initially
    this.disableAllFields();
  }

  onUpdateTypeChange(updateType: LOAN_UPDATE_TYPES) {
    // First, disable all conditional fields
    this.disableAllFields();

    // Then enable fields based on update type
    switch (updateType) {
      case 'Enhancement':
        // Enable principal amount and tenure
        this.loanUpdateForm.get('principalAmount')?.enable();
        this.loanUpdateForm.get('totalMonths')?.enable();
        this.loanUpdateForm
          .get('principalAmount')
          ?.setValidators([Validators.required, Validators.min(1)]);
        this.loanUpdateForm
          .get('totalMonths')
          ?.setValidators([Validators.required, Validators.min(1)]);
        break;

      case 'Tenure_Change':
        // Enable tenure only
        this.loanUpdateForm.get('totalMonths')?.enable();
        this.loanUpdateForm
          .get('totalMonths')
          ?.setValidators([Validators.required, Validators.min(1)]);
        break;

      case 'Repayment_Method_Change':
        // Enable account number only
        this.loanUpdateForm.get('accountNumber')?.enable();
        this.loanUpdateForm
          .get('accountNumber')
          ?.setValidators([Validators.required]);
        break;

      case 'Part_prepayment':
        // Enable prepayment amount only
        this.loanUpdateForm.get('prePaymentAmount')?.enable();
        this.loanUpdateForm
          .get('prePaymentAmount')
          ?.setValidators([Validators.required, Validators.min(1)]);
        break;

      case 'Restructuring':
        // Enable description, tenure, and interest rate
        this.loanUpdateForm.get('description')?.enable();
        this.loanUpdateForm.get('totalMonths')?.enable();
        this.loanUpdateForm.get('interestRate')?.enable();
        this.loanUpdateForm.get('loanDate')?.enable();
        this.loanUpdateForm
          .get('description')
          ?.setValidators([Validators.required]);
        this.loanUpdateForm
          .get('totalMonths')
          ?.setValidators([Validators.required, Validators.min(1)]);
        this.loanUpdateForm
          .get('interestRate')
          ?.setValidators([Validators.required, Validators.min(0)]);
        this.loanUpdateForm
          .get('loanDate')
          ?.setValidators([Validators.required]);
        break;
    }

    // Update value and validity for all fields
    Object.keys(this.loanUpdateForm.controls).forEach((key) => {
      this.loanUpdateForm.get(key)?.updateValueAndValidity();
    });
  }

  disableAllFields() {
    this.loanUpdateForm.get('principalAmount')?.disable();
    this.loanUpdateForm.get('totalMonths')?.disable();
    this.loanUpdateForm.get('accountNumber')?.disable();
    this.loanUpdateForm.get('prePaymentAmount')?.disable();
    this.loanUpdateForm.get('description')?.disable();
    this.loanUpdateForm.get('interestRate')?.disable();
    this.loanUpdateForm.get('loanDate')?.disable();

    // Clear validators
    this.loanUpdateForm.get('principalAmount')?.clearValidators();
    this.loanUpdateForm.get('totalMonths')?.clearValidators();
    this.loanUpdateForm.get('accountNumber')?.clearValidators();
    this.loanUpdateForm.get('prePaymentAmount')?.clearValidators();
    this.loanUpdateForm.get('description')?.clearValidators();
    this.loanUpdateForm.get('interestRate')?.clearValidators();
    this.loanUpdateForm.get('loanDate')?.clearValidators();
  }

  onSubmit() {
    if (this.loanUpdateForm.invalid || !this.loan()) {
      this.markFormGroupTouched(this.loanUpdateForm);
      return;
    }

    this.isSubmitting = true;

    // Get only enabled fields for submission
    const formValue = this.loanUpdateForm.getRawValue();

    this.loanService
      .updateLoan(this.loan()!.id, formValue, this.userId)
      .subscribe({
        next: (response) => {
          this.messageService.add({
            key: 'custom-toast',
            severity: 'success',
            summary: 'Loan Updated',
            detail: 'Your loan has been successfully updated.',
          });
          this.isSubmitting = false;
          this.closeDialog('submit');
        },
        error: (err) => {
          console.error('Failed to update loan', err);
          this.messageService.add({
            key: 'custom-toast',
            severity: 'error',
            summary: 'Update Failed',
            detail: 'Failed to update loan. Please try again.',
          });
          this.isSubmitting = false;
        },
      });
  }

  closeDialog(type: 'submit' | 'cancel' = 'cancel') {
    this.loanUpdateForm.reset();
    this.disableAllFields();
    this.visibleChange.emit({ visible: false, type });
  }

  private markFormGroupTouched(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach((key) => {
      const control = formGroup.get(key);
      control?.markAsTouched();
    });
  }

  // Helper to check if field has error
  hasError(fieldName: string): boolean {
    const field = this.loanUpdateForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getErrorMessage(fieldName: string): string {
    const field = this.loanUpdateForm.get(fieldName);
    if (field?.hasError('required')) {
      return 'This field is required';
    }
    if (field?.hasError('min')) {
      return 'Value must be greater than 0';
    }
    return '';
  }

  // Calculate total principal for Enhancement (current + additional)
  getTotalPrincipal(): number {
    const currentPrincipal = this.loan()?.principalAmount || 0;
    const additionalPrincipal =
      this.loanUpdateForm.get('principalAmount')?.value || 0;
    return currentPrincipal + additionalPrincipal;
  }

  // Calculate total tenure for Restructuring (current + additional)
  getTotalTenure(): number {
    const currentTenure = this.loan()?.totalMonths || 0;
    const additionalTenure = this.loanUpdateForm.get('totalMonths')?.value || 0;
    return currentTenure + additionalTenure;
  }
}
