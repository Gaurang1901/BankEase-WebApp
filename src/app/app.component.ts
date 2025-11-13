import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DatePickerModule } from 'primeng/datepicker';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { FormsModule } from '@angular/forms';
import { TextareaModule } from 'primeng/textarea';
import { ToasterComponent } from './components/toaster/toaster.component';
import { ConfirmDialog, ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { NgxUiLoaderModule } from 'ngx-ui-loader';

interface City {
  name: string;
  code: string;
}
@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    ButtonModule,
    CardModule,
    DatePickerModule,
    SelectModule,
    FormsModule,
    InputTextModule,
    TextareaModule,
    ToasterComponent,
    ConfirmDialogModule,
    ConfirmDialog,
    NgxUiLoaderModule,
  ],
  providers: [ConfirmationService, MessageService],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  title = 'numany-main';

  toggleDarkMode() {
    const element = document.querySelector('html');
    if (element !== null) {
      element.classList.toggle('my-app-dark');
    }
  }

  cities: City[] | undefined;

  selectedCity: City | undefined;

  ngOnInit() {
    this.cities = [
      { name: 'New York', code: 'NY' },
      { name: 'Rome', code: 'RM' },
      { name: 'London', code: 'LDN' },
      { name: 'Istanbul', code: 'IST' },
      { name: 'Paris', code: 'PRS' },
    ];
  }
}
