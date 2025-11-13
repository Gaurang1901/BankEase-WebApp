import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatePickerModule } from 'primeng/datepicker';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-reusable-date-range-picker',
  standalone: true,
  imports: [
    DatePickerModule,
    FormsModule,
    CommonModule,
    ButtonModule,
    InputTextModule,
  ],
  templateUrl: './reusable-date-range-picker.component.html',
  styleUrl: './reusable-date-range-picker.component.css',
})
export class ReusableDateRangePickerComponent {
  @Input() rangeDatesInput: Date[] = [new Date('01-01-2025'), new Date()];

  @Output() dateChange = new EventEmitter<Date[]>();

  ngOnInit(): void {
    this.onDateChange();
  }

  normalizeDate(date: Date): string {
    const offset = date.getTimezoneOffset();
    const correctedDate = new Date(date.getTime() - offset * 60 * 1000);
    return correctedDate.toISOString().split('T')[0];
  }

  onDateChange() {
    const isDateNull = this.rangeDatesInput.some((date) => date === null);
    if (!isDateNull) {
      this.rangeDatesInput.map((date) => this.normalizeDate(date));
      this.dateChange.emit(this.rangeDatesInput);
    }
  }

  clearDateRange() {
    this.rangeDatesInput = [];
    this.dateChange.emit(this.rangeDatesInput); 
  }
  
  setRange(months: number) {
    const today = new Date();
    const fromDate = new Date();
    fromDate.setMonth(today.getMonth() - months);

    this.rangeDatesInput = [fromDate, today];
    this.onDateChange();
  }
}
