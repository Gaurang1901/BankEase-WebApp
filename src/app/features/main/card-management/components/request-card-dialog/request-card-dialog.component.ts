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
import { CardService } from '../../service/card.service';
import { AuthService } from '../../../../../core/auth/services/auth.service';
import { User } from '../../../../../core/auth/store/auth.state';
import { IdempotencyService } from '../../../../../core/auth/services/idempotency.service';

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
  user: User | null = null;

  formHelper = inject(FormHelper);
  messageService = inject(MessageService);
  cardService = inject(CardService);
  authService = inject(AuthService);
  idempotencyService = inject(IdempotencyService);

  constructor() {
    this.authService.getUserProfile().subscribe((user) => {
      this.user = user;
    });
  }

  ngOnInit() {
    this.initializeForm();
  }

  initializeForm() {
    this.requestCardForm = new FormGroup({
      cardHolderName: new FormControl(this.user?.name || '', [
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

    this.idempotencyService.generateKey().subscribe((key) => {
      this.cardService
        .requestCard(
          this.requestCardForm.value,
          this.user?.accountId!,
          this.user?.userId!,
          key,
        )
        .subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Card requested successfully',
            });
            this.visibleChange.emit({
              visible: false,
              type: 'submit',
            });
          },
          error: (error) => {
            this.close();
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: error.message,
            });
          },
        });
    });
  }
}
