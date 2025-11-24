import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  inject,
} from '@angular/core';
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
import { DropdownModule } from 'primeng/dropdown';
import { BudgetRequest, BudgetResponse } from '../../models/budget.model';
import {
  BUDGET_CATEGORY,
  REVENUE_PERIOD_TYPE,
} from '../../../../../core/types/constants';

@Component({
  selector: 'app-budget-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DialogModule,
    ButtonModule,
    InputNumberModule,
    DropdownModule,
  ],
  templateUrl: './budget-dialog.component.html',
  styles: [],
})
export class BudgetDialogComponent implements OnChanges {
  @Input() visible = false;
  @Input() budget: BudgetResponse | null = null;
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() save = new EventEmitter<BudgetRequest>();

  fb = inject(FormBuilder);
  budgetForm: FormGroup;
  editMode = false;

  categories = Object.values(BUDGET_CATEGORY);
  periods = Object.values(REVENUE_PERIOD_TYPE);

  constructor() {
    this.budgetForm = this.fb.group({
      category: ['', Validators.required],
      amount: [null, [Validators.required, Validators.min(0.01)]],
      period: ['', Validators.required],
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['visible'] && this.visible) {
      if (this.budget) {
        this.editMode = true;
        this.budgetForm.patchValue({
          category: this.budget.category,
          amount: this.budget.amount,
          period: this.budget.period,
        });
        // Disable category in edit mode if required, usually budget category shouldn't change?
        // Requirement doesn't specify, but usually ID is tied to it. Let's allow change for now.
      } else {
        this.editMode = false;
        this.budgetForm.reset();
      }
    }
  }

  isFieldInvalid(field: string): boolean {
    const control = this.budgetForm.get(field);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  onHide() {
    this.visible = false;
    this.visibleChange.emit(false);
    this.budgetForm.reset();
  }

  onSubmit() {
    if (this.budgetForm.valid) {
      this.save.emit(this.budgetForm.value);
      this.onHide();
    } else {
      this.budgetForm.markAllAsTouched();
    }
  }
}
