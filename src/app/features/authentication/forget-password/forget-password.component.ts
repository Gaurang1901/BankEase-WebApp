import { Component, inject } from '@angular/core';
import {
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-forget-password',
  imports: [ReactiveFormsModule, ButtonModule],
  templateUrl: './forget-password.component.html',
  styleUrl: './forget-password.component.css',
})
export class ForgetPasswordComponent {
  private readonly router = inject(Router);
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly messageService = inject(MessageService);
  Loading: boolean = false;

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.minLength(3)]],
  });

  constructor() {}

  onSubmit() {}
}
