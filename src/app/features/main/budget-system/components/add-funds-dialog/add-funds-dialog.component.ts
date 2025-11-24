import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputNumberModule } from 'primeng/inputnumber';
import { AddFundsRequest } from '../../models/budget.model';

@Component({
  selector: 'app-add-funds-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DialogModule,
    ButtonModule,
    InputNumberModule,
  ],
  templateUrl: './add-funds-dialog.component.html',
  styles: [],
})
export class AddFundsDialogComponent {
  @Input() visible = false;
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() save = new EventEmitter<AddFundsRequest>();

  fb = inject(FormBuilder);
  fundsForm: FormGroup;

  constructor() {
    this.fundsForm = this.fb.group({
      amount: [null, [Validators.required, Validators.min(0.01)]],
    });
  }

  isFieldInvalid(field: string): boolean {
    const control = this.fundsForm.get(field);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  onHide() {
    this.visible = false;
    this.visibleChange.emit(false);
    this.fundsForm.reset();
  }

  onSubmit() {
    if (this.fundsForm.valid) {
      this.save.emit(this.fundsForm.value);
      this.onHide();
    } else {
      this.fundsForm.markAllAsTouched();
    }
  }
}
