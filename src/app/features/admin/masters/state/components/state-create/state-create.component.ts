import { Component, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { StateModel } from '../../models/state.model';
import { MasterService } from '../../../services/master.service';
import { MessageService } from 'primeng/api';
import { Location } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { InputGroupComponent } from '../../../../../../components/input-group/input-group.component';
import { FormHelper } from '../../../../../../core/utils/form.helper';

@Component({
  selector: 'app-state-create',
  imports: [
    ReactiveFormsModule,
    InputTextModule,
    ButtonModule,
    InputGroupComponent,
  ],
  templateUrl: './state-create.component.html',
  styleUrl: './state-create.component.css',
})
export class StateCreateComponent {
  stateForm!: FormGroup;
  stateData!: StateModel;

  masterService = inject(MasterService);
  messageService = inject(MessageService);
  location = inject(Location);
  formHelper = inject(FormHelper);

  ngOnInit(): void {
    this.createForm();
    this.patchDataFromLocation();
  }

  createForm() {
    this.stateForm = new FormGroup({
      id: new FormControl(''),
      name: new FormControl('', [
        Validators.required,
        Validators.min(3),
        Validators.max(50),
      ]),
      code: new FormControl('', [
        Validators.required,
        Validators.min(2),
        Validators.max(10),
      ]),
      countryId: new FormControl('74f2cb3b-fd9f-42af-bee1-de3901669921', [
        Validators.required,
      ]),
    });
  }

  patchDataFromLocation() {
    const locationData: any = this.location.getState() as StateModel;
    if (locationData.data) {
      this.stateData = locationData.data;
      this.stateForm.patchValue(locationData.data);
    }
  }

  onSubmit() {
    if (this.stateForm.valid) {
      const stateData = this.stateForm.value;
      if (this.stateData && this.stateData.id) {
        this.updateState(stateData);
      } else {
        this.createState(stateData);
      }
    } else {
      this.messageService.add({
        key: 'custom-toast',
        severity: 'error',
        summary: 'Error',
        detail: 'Please fill all the required fields',
      });
    }
  }

  createState(stateData: StateModel) {
    this.masterService.createState(stateData).subscribe({
      next: () => {
        this.messageService.add({
          key: 'custom-toast',
          severity: 'success',
          summary: 'Success',
          detail: 'State created successfully',
        });
        this.location.back();
      },
      error: (err) => {
        this.messageService.add({
          key: 'custom-toast',
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to create state',
        });
      },
    });
  }

  updateState(stateData: StateModel) {
    this.masterService.updateState(stateData).subscribe({
      next: () => {
        this.messageService.add({
          key: 'custom-toast',
          severity: 'success',
          summary: 'Success',
          detail: 'State updated successfully',
        });
        this.location.back();
      },
      error: (err) => {
        this.messageService.add({
          key: 'custom-toast',
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to update state',
        });
      },
    });
  }
}
