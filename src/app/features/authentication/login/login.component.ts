import { Component, effect, inject, untracked } from '@angular/core';
import { Router } from '@angular/router';
import {
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthStore } from '../../../core/auth/store/auth.store';
import { CommonModule } from '@angular/common';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { CheckboxModule } from 'primeng/checkbox';
import { TabViewModule } from 'primeng/tabview';
import { TabView } from 'primeng/tabview';
import { PasswordModule } from 'primeng/password';

@Component({
  selector: 'app-login',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    CardModule,
    InputTextModule,
    MessageModule,
    CheckboxModule,
    TabViewModule,
    PasswordModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  readonly store = inject(AuthStore);
  private readonly router = inject(Router);
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly messageService = inject(MessageService);

  activeIndex = 0;

  accountLoginForm = this.fb.group({
    accountNumber: ['', [Validators.required, Validators.minLength(10)]],
    password: ['', [Validators.required]],
    rememberMe: [false],
  });

  otpLoginForm = this.fb.group({
    accountNumber: ['', [Validators.required, Validators.minLength(10)]],
    otp: [
      '',
      [Validators.required, Validators.minLength(6), Validators.maxLength(6)],
    ],
  });

  adminLoginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
    rememberMe: [false],
  });

  showOTPInput = false;
  otpSent = false;

  constructor() {
    effect(() => {
      if (this.store.isAuthenticated()) {
        this.messageService.add({
          key: 'custom-toast',
          severity: 'success',
          summary: 'Success',
          detail: 'Logged in successfully!',
          styleClass: 'border-none bg-white',
        });

        untracked(() => {
          this.router.navigateByUrl('/');
        });
        console.log(
          'this.store.isAuthenticated()',
          this.store.isAuthenticated()
        );
      }
    });

    effect(() => {
      const errorMessage = this.store.error();
      console.log('errorMessage', errorMessage);

      if (errorMessage) {
        this.messageService.add({
          key: 'custom-toast',
          severity: 'error',
          summary: 'Login Failed',
          detail: 'Please check your Credentials',
          life: 3000,
        });
      }
    });
  }

  onSubmit(formType: 'account' | 'otp' | 'admin') {
    switch (formType) {
      case 'account':
        if (this.accountLoginForm.valid) {
          this.store.login({
            ...this.accountLoginForm.getRawValue(),
            type: 'account',
          });
        }
        break;

      case 'otp':
        if (this.otpLoginForm.valid) {
          if (!this.otpSent) {
            // Send OTP
            this.sendOTP(this.otpLoginForm.get('accountNumber')?.value ?? '');
          } else {
            // Verify OTP
            this.store.login({
              ...this.otpLoginForm.getRawValue(),
              type: 'otp',
            });
          }
        }
        break;

      case 'admin':
        if (this.adminLoginForm.valid) {
          this.store.login({
            ...this.adminLoginForm.getRawValue(),
            type: 'admin',
          });
        }
        break;
    }
  }

  sendOTP(accountNumber: string) {
    // TODO: Implement OTP sending logic
    this.messageService.add({
      key: 'custom-toast',
      severity: 'info',
      summary: 'OTP Sent',
      detail: 'Please check your registered mobile number for OTP',
      life: 3000,
    });
    this.otpSent = true;
    this.showOTPInput = true;
  }

  resendOTP() {
    const accountNumber = this.otpLoginForm.get('accountNumber')?.value;
    if (accountNumber) {
      this.sendOTP(accountNumber);
    }
  }
}
