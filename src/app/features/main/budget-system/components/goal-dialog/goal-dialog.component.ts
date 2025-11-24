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
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { CalendarModule } from 'primeng/calendar';
import { CheckboxModule } from 'primeng/checkbox';
import { CreateGoalRequest, GoalResponse } from '../../models/budget.model';

@Component({
  selector: 'app-goal-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DialogModule,
    ButtonModule,
    InputTextModule,
    InputNumberModule,
    CalendarModule,
    CheckboxModule,
  ],
  templateUrl: './goal-dialog.component.html',
  styles: [],
})
export class GoalDialogComponent implements OnChanges {
  @Input() visible = false;
  @Input() goal: GoalResponse | null = null;
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() save = new EventEmitter<CreateGoalRequest>();

  fb = inject(FormBuilder);
  goalForm: FormGroup;
  editMode = false;
  minDate = new Date();

  constructor() {
    this.goalForm = this.fb.group({
      name: ['', Validators.required],
      targetAmount: [null, [Validators.required, Validators.min(0.01)]],
      deadline: [null, Validators.required],
      autoDeductEnabled: [false],
      autoDeductAmount: [null],
    });

    // Conditional validation for autoDeductAmount
    this.goalForm
      .get('autoDeductEnabled')
      ?.valueChanges.subscribe((enabled) => {
        const amountControl = this.goalForm.get('autoDeductAmount');
        if (enabled) {
          amountControl?.setValidators([
            Validators.required,
            Validators.min(0.01),
          ]);
        } else {
          amountControl?.clearValidators();
          amountControl?.setValue(null);
        }
        amountControl?.updateValueAndValidity();
      });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['visible'] && this.visible) {
      if (this.goal) {
        this.editMode = true;
        this.goalForm.patchValue({
          name: this.goal.name,
          targetAmount: this.goal.targetAmount,
          deadline: new Date(this.goal.deadline),
          autoDeductEnabled: this.goal.autoDeductEnabled,
          autoDeductAmount: this.goal.autoDeductAmount,
        });
      } else {
        this.editMode = false;
        this.goalForm.reset({ autoDeductEnabled: false });
      }
    }
  }

  isFieldInvalid(field: string): boolean {
    const control = this.goalForm.get(field);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  onHide() {
    this.visible = false;
    this.visibleChange.emit(false);
    this.goalForm.reset();
  }

  onSubmit() {
    if (this.goalForm.valid) {
      const formValue = this.goalForm.value;
      // Format date to YYYY-MM-DD
      const deadline =
        formValue.deadline instanceof Date
          ? formValue.deadline.toISOString().split('T')[0]
          : formValue.deadline;

      const request: CreateGoalRequest = {
        ...formValue,
        deadline,
      };
      this.save.emit(request);
      this.onHide();
    } else {
      this.goalForm.markAllAsTouched();
    }
  }
}
