import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
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
import { RadioButtonModule } from 'primeng/radiobutton';
import { TextareaModule } from 'primeng/textarea';
import { CloseAccountPayload } from '../../models/account.model';

@Component({
  selector: 'app-close-account-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DialogModule,
    ButtonModule,
    RadioButtonModule,
    TextareaModule,
  ],
  providers: [CurrencyPipe],
  templateUrl: './close-account-dialog.component.html',
})
export class CloseAccountDialogComponent implements OnInit, OnChanges {
  @Input() visible = false;
  @Input() balance = 0;
  @Input() currency = 'USD';
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() formSubmit = new EventEmitter<CloseAccountPayload>();

  closeAccountForm: FormGroup;
  isSubmitting = false;

  closureReasons = [
    { label: 'Switching to another bank', value: 'switching_bank' },
    { label: 'High fees or charges', value: 'high_fees' },
    { label: 'Poor customer service', value: 'poor_service' },
    { label: 'Lack of features or functionality', value: 'lack_of_features' },
    { label: 'No longer need the account', value: 'no_longer_needed' },
    { label: 'Relocating to another country', value: 'relocating' },
    { label: 'Other reason', value: 'other' },
  ];

  constructor(private fb: FormBuilder) {
    this.closeAccountForm = this.fb.group({
      reason: ['', [Validators.required]],
      comments: [''],
    });
  }

  ngOnInit(): void {
    // Watch for changes to the 'reason' radio button
    this.closeAccountForm.get('reason')?.valueChanges.subscribe((value) => {
      const commentsControl = this.closeAccountForm.get('comments');
      if (value === 'other') {
        // If 'Other' is selected, make comments required
        commentsControl?.setValidators([Validators.required]);
      } else {
        // Otherwise, remove validators
        commentsControl?.clearValidators();
      }
      commentsControl?.updateValueAndValidity();
    });
  }

  // Reset form when dialog becomes visible
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['visible'] && this.visible) {
      this.closeAccountForm.reset();
      this.isSubmitting = false;
    }
  }

  get isOtherReasonSelected(): boolean {
    return this.closeAccountForm.get('reason')?.value === 'other';
  }

  onCancel(): void {
    this.visibleChange.emit(false);
  }

  onSubmit(): void {
    if (this.closeAccountForm.invalid) {
      // Mark all fields as touched to show validation errors
      this.closeAccountForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    const payload: CloseAccountPayload = {
      reason: this.closeAccountForm.value.reason,
      comments: this.closeAccountForm.value.comments || undefined,
    };

    this.formSubmit.emit(payload);
  }
}
