import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { DatePickerModule } from 'primeng/datepicker';

@Component({
  selector: 'app-statement-download-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DialogModule,
    ButtonModule,
    DatePickerModule,
  ],
  templateUrl: './statement-download-dialog.component.html',
  styles: [],
})
export class StatementDownloadDialogComponent {
  @Input() visible: boolean = false;
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() download = new EventEmitter<{ startDate: Date; endDate: Date }>();

  maxDate = new Date();
  dateRangeControl = new FormControl<Date[] | null>(null, Validators.required);

  get isDownloadDisabled(): boolean {
    const value = this.dateRangeControl.value;
    return !value || value.length !== 2 || !value[0] || !value[1];
  }

  onHide() {
    this.visible = false;
    this.visibleChange.emit(this.visible);
    this.dateRangeControl.reset();
  }

  onDownload() {
    if (this.dateRangeControl.valid && this.dateRangeControl.value) {
      const [startDate, endDate] = this.dateRangeControl.value;
      if (startDate && endDate) {
        // Set times as requested: start at 00:00:00, end at max time (23:59:59.999)
        const start = new Date(startDate);
        start.setHours(0, 0, 0, 0);

        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);

        this.download.emit({ startDate: start, endDate: end });
        this.onHide();
      }
    }
  }
}
