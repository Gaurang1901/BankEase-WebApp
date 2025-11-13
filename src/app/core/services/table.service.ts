import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CustomTableService {
  refreshTable: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  filterString: BehaviorSubject<string> = new BehaviorSubject<string>('');

  filterString$: Observable<string> = this.filterString.asObservable();
  refreshTable$: Observable<boolean> = this.refreshTable.asObservable();

  constructor() {}

  setfilterString(value: string) {
    this.filterString.next(value);
  }

  getfilterString(): Observable<string> {
    return this.filterString.asObservable();
  }

  setrefreshTable(value: boolean) {
    this.refreshTable.next(value);
  }

  getrefreshTable(): Observable<boolean> {
    return this.refreshTable.asObservable();
  }
}
