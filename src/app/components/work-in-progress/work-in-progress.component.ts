import { Component } from '@angular/core';
import { PageHeaderService } from '../../core/services/page-header.service';

@Component({
  selector: 'app-work-in-progress',
  imports: [],
  templateUrl: './work-in-progress.component.html',
  styleUrl: './work-in-progress.component.css',
})
export class WorkInProgressComponent {
  constructor(private _pageHeaderService: PageHeaderService) {}

  ngOnInit(): void {
    this._pageHeaderService.setTitle('Work In Progress');
    this._pageHeaderService.setBreadcrumb([{ label: 'Work In Progress' }]);
  }
}
