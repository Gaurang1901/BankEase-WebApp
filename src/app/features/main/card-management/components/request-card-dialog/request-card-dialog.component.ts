import {
  Component,
  EventEmitter,
  inject,
  Input,
  input,
  Output,
} from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputGroupComponent } from '../../../../../components/input-group/input-group.component';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { FormHelper } from '../../../../../core/utils/form.helper';
import { MessageService } from 'primeng/api';
import { Select, SelectModule } from 'primeng/select';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-request-card-dialog',
  imports: [
    DialogModule,
    ButtonModule,
    InputGroupComponent,
    ReactiveFormsModule,
    SelectModule,
    InputTextModule,
  ],
  templateUrl: './request-card-dialog.component.html',
  styleUrl: './request-card-dialog.component.css',
})
export class RequestCardDialogComponent {
  isSubmitting: boolean = false;

  @Input() visible: boolean = false;
  @Output() visibleChange = new EventEmitter<{
    visible: boolean;
    type: 'submit' | 'cancel';
  }>();
  requestCardForm!: FormGroup;
  cardTypes: string[] = ['CREDIT', 'DEBIT'];

  formHelper = inject(FormHelper);
  messageService = inject(MessageService);

  constructor() {}

  ngOnInit() {
    this.initializeForm();
  }

  initializeForm() {
    this.requestCardForm = new FormGroup({
      cardHolderName: new FormControl('', [
        Validators.required,
        Validators.minLength(2),
      ]),

      cardType: new FormControl('', [Validators.required]),
    });
  }

  close() {
    this.visible = false;
    this.visibleChange.emit({
      visible: false,
      type: 'cancel',
    });
  }

  onRequestCard() {
    this.isSubmitting = true;
    this.visibleChange.emit({
      visible: false,
      type: 'submit',
    });
  }
}
