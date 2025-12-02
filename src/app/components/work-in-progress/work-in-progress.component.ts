import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-work-in-progress',
  standalone: true,
  imports: [CommonModule, RouterModule, ButtonModule],
  templateUrl: './work-in-progress.component.html',
  styles: [],
})
export class WorkInProgressComponent {}
