import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import {
  TransactionType,
  TransactionPayload,
} from '../../models/transaction.model';
import { Select } from 'primeng/select';
import { Enum } from '../../../../../core/types/helper.model';
import { BUDGET_CATEGORY } from '../../../../../core/types/constants';
import { AuthService } from '../../../../../core/auth/services/auth.service';
import { User } from '../../../../../core/auth/store/auth.state';

export interface TransactionSubmitEvent {
  payload: TransactionPayload;
  idempotencyKey: string;
}

@Component({
  selector: 'app-transaction-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CurrencyPipe,
    DialogModule,
    ButtonModule,
    InputNumberModule,
    InputTextModule,
    TextareaModule,
    Select,
  ],
  templateUrl: './transaction-dialog.component.html',
})
export class TransactionDialogComponent implements OnChanges {
  @Input() visible = false;
  @Input({ required: true }) type!: TransactionType;
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() formSubmit = new EventEmitter<TransactionSubmitEvent>();

  transactionForm!: FormGroup;
  isSubmitting = false;
  private idempotencyKey!: string;
  budgetCategories: Enum[] = Object.values(BUDGET_CATEGORY);
  user: User | null = null;

  constructor(private fb: FormBuilder, private authService: AuthService) {}

  ngOnChanges(changes: SimpleChanges): void {
    // Re-initialize the form and generate a new UUID whenever the dialog is made visible
    if (changes['visible'] && this.visible) {
      this.initializeComponent();
    }
  }

  private initializeComponent(): void {
    this.isSubmitting = false;
    // Generate a unique Idempotency Key for this specific transaction attempt
    this.idempotencyKey = crypto.randomUUID();
    this.buildForm();
    this.authService.getUserProfile().subscribe((user) => {
      if (user === null) return;
      this.user = user;
      this.transactionForm.patchValue({
        fromAccountNumber: user.accountNumber,
      });
    });
  }

  private buildForm(): void {
    const formConfig: { [key: string]: any } = {
      amount: [null, [Validators.required, Validators.min(0.01)]],
      fromAccountNumber: [
        this.user?.accountNumber,
        [Validators.required, Validators.minLength(5)],
      ],
      description: [''],
      referenceNumber: [null],
      transactionChannel: ['NEFT'],
      budgetCategory: [null],
      transactionType: this.type,
    };

    if (this.type === 'TRANSFER') {
      formConfig['toAccountNumber'] = [
        '',
        [Validators.required, Validators.minLength(5)],
      ];
    }

    this.transactionForm = this.fb.group(formConfig);
  }

  get dialogTitle(): string {
    return `${this.type} Money`;
  }
  get dialogSubtitle(): string {
    switch (this.type) {
      case 'DEPOSIT':
        return 'Add money to your account';
      case 'WITHDRAW':
        return 'Withdraw money from your account';
      case 'TRANSFER':
        return 'Transfer money to another account';
    }
  }

  onCancel(): void {
    this.visibleChange.emit(false);
  }

  onSubmit(): void {
    if (this.transactionForm.invalid) {
      this.transactionForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    const payload: TransactionPayload = this.transactionForm.value;

    this.formSubmit.emit({ payload, idempotencyKey: this.idempotencyKey });
  }
}
