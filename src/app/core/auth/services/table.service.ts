import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TableService {
  isDeleted: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  isDeleted$: Observable<boolean> = this.isDeleted.asObservable();
  constructor() {}

  setIsDeleted(value: boolean) {
    this.isDeleted.next(value);
  }

  getIsDeleted(): Observable<boolean> {
    return this.isDeleted.asObservable();
  }
}
