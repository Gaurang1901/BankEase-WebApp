import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { StepsModule } from 'primeng/steps';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/auth/services/auth.service';
import { Password } from 'primeng/password';
import { switchMap } from 'rxjs/operators';
import { of } from 'rxjs';

interface State {
  name: string;
  code: string;
}

interface Country {
  name: string;
  code: string;
}

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    StepsModule,
    CardModule,
    ButtonModule,
    InputTextModule,
    CalendarModule,
    DropdownModule,
    InputNumberModule,
    Password,
  ],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css',
})
export class SignupComponent {
  private fb = inject(FormBuilder);
  private messageService = inject(MessageService);
  private router = inject(Router);
  private authService = inject(AuthService);

  currentStep = 0;
  userData: any;
  steps = [{ label: 'Personal Details' }, { label: 'Account Details' }];

  accountTypes = [
    { label: 'Savings Account', value: 'SAVING' },
    { label: 'Current Account', value: 'CURRENT' },
    { label: 'Loan Account', value: 'LOAN' },
  ];

  countries: Country[] = [
    { name: 'United States', code: 'US' },
    { name: 'United Kingdom', code: 'UK' },
    { name: 'India', code: 'IN' },
    // Add more countries as needed
  ];

  states: State[] = [
    { name: 'New York', code: 'NY' },
    { name: 'California', code: 'CA' },
    { name: 'Texas', code: 'TX' },
    // Add more states as needed
  ];

  ngOnInit() {
    // this.getcountries();
    this.getStates();
  }

  userForm = this.fb.group(
    {
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      gender: ['MALE', [Validators.required]],
      confirmPassword: ['', [Validators.required]],
      phone: ['', [Validators.required]],
      dateOfBirth: ['', [Validators.required]],
      address: ['', [Validators.required]],
      country: ['', [Validators.required]],
      state: ['', [Validators.required]],
      city: ['', [Validators.required]],
      zipCode: ['', [Validators.required]],
    },
    {
      validators: this.passwordMatchValidator,
    }
  );

  accountForm = this.fb.group({
    accountType: ['', [Validators.required]],
    initialDeposit: [0, [Validators.required, Validators.min(1000)]],
  });

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password');
    const confirmPassword = form.get('confirmPassword');

    if (password?.value !== confirmPassword?.value) {
      confirmPassword?.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }

    confirmPassword?.setErrors(null);
    return null;
  }

  onNext() {
    let userPayload: any;
    if (this.currentStep === 0) {
      if (this.userForm.valid) {
        userPayload = {
          name: `${this.userForm.get('firstName')?.value} ${
            this.userForm.get('lastName')?.value
          }`,
          email: this.userForm.get('email')?.value,
          phoneNo: this.userForm.get('phone')?.value,
          password: this.userForm.get('password')?.value,
          role: 'ROLE_USER',
          dob: this.userForm.get('dateOfBirth')?.value,
          gender: this.userForm.get('gender')?.value,
          address: {
            addressLine1: this.userForm.get('address')?.value,
            addressLine2: this.userForm.get('address')?.value,
            city: this.userForm.get('city')?.value,
            state: this.userForm.get('state')?.value,
            country: this.userForm.get('country')?.value,
            zipCode: this.userForm.get('zipCode')?.value,
          },
        };

        // Create the user immediately when clicking Next
        // this.createUser(userPayload);
        this.currentStep++;
        return;
      } else {
        this.userForm.markAllAsTouched();
        this.messageService.add({
          key: 'custom-toast',
          severity: 'error',
          summary: 'Error',
          detail: 'Please fill all required fields correctly.',
        });
      }
    } else {
      if (this.accountForm.valid) {
        // If user was already created in previous step use that id, otherwise create user then account
        this.onCreateAccount();
      } else {
        this.accountForm.markAllAsTouched();
        this.messageService.add({
          key: 'custom-toast',
          severity: 'error',
          summary: 'Error',
          detail: 'Please fill all required fields correctly.',
        });
      }
    }
  }

  onCreateAccount() {
    // If user already created (this.userData) use that userId, otherwise create user first
    let createUser$;
    if (this.userData && (this.userData.id || this.userData.userId)) {
      // Already have user from previous step
      createUser$ = of({ data: this.userData });
    } else {
      // Build user payload from form and create user first
      const builtUserPayload = {
        name: `${this.userForm.get('firstName')?.value} ${
          this.userForm.get('lastName')?.value
        }`,
        email: this.userForm.get('email')?.value,
        phoneNo: this.userForm.get('phone')?.value,
        password: this.userForm.get('password')?.value,
        role: 'ROLE_USER',
        dateOfBirth: this.userForm.get('dateOfBirth')?.value,
        gender: this.userForm.get('gender')?.value,
        address: {
          addressLine1: this.userForm.get('address')?.value,
          addressLine2: this.userForm.get('address')?.value,
          city: this.userForm.get('city')?.value,
          stateId: this.userForm.get('state')?.value,
          country: this.userForm.get('country')?.value,
          zipCode: this.userForm.get('zipCode')?.value,
        },
      };

      createUser$ = this.authService.createUser(builtUserPayload);
    }

    createUser$
      .pipe(
        switchMap((response: any) => {
          // extract user id from different possible shapes
          const userId =
            response?.data?.user?.id ||
            this.userData?.id ||
            this.userData?.userId;

          const accountPayload = {
            userId,
            accountType: this.accountForm.get('accountType')?.value,
            initialDeposit: this.accountForm.get('initialDeposit')?.value,
          };

          return this.authService.createAccount(accountPayload);
        })
      )
      .subscribe({
        next: (res) => {
          this.messageService.add({
            key: 'custom-toast',
            severity: 'success',
            summary: 'Success',
            detail: 'Account created successfully!',
          });
          this.router.navigate(['/login']);
        },
        error: (err) => {
          console.error('Failed to create user/account', err);
          this.messageService.add({
            key: 'custom-toast',
            severity: 'error',
            summary: 'Error',
            detail:
              err?.error?.message ||
              'Failed to create account. Please try again.',
          });
        },
      });
  }

  onPrevious() {
    if (this.currentStep > 0) {
      this.currentStep--;
    }
  }

  navigateToLogin() {
    this.router.navigate(['/login']);
  }

  getStates() {
    this.authService.getStates().subscribe({
      next: (response: any) => {
        this.states = response.content;
      },
      error: (error: any) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to fetch states. Please try again.',
        });
      },
    });
  }
}
