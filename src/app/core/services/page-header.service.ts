import { Injectable, signal } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { BehaviorSubject, Subject } from 'rxjs';

export interface PageHeader {
  title?: string;
  description?: string;
  breadcrumbs?: MenuItem[];
}

const initialState: PageHeader = {
  title: undefined,
  description: undefined,
  breadcrumbs: [],
};

@Injectable({
  providedIn: 'root',
})
export class PageHeaderService {
  private titleSubject = new Subject<string>();
  private breadcrumbItemsSubject = new Subject<MenuItem[]>();
  private descriptionSubject = new Subject<string>();

  title$ = this.titleSubject.asObservable();
  breadcrumbItems$ = this.breadcrumbItemsSubject.asObservable();
  description$ = this.descriptionSubject.asObservable();

  private defaultHome: MenuItem = { icon: 'pi pi-home', routerLink: '/' };
  private homeSubject = new BehaviorSubject<MenuItem | undefined>(
    this.defaultHome
  );
  home$ = this.homeSubject.asObservable();

  constructor() {}

  setHome(home: MenuItem | undefined) {
    setTimeout(() => {
      this.homeSubject.next(home);
    });
  }

  setTitle(title: string) {
    setTimeout(() => {
      this.titleSubject.next(title);
    });
  }

  setBreadcrumb(breadCrumb: MenuItem[]) {
    setTimeout(() => {
      this.breadcrumbItemsSubject.next(breadCrumb);

      if (!this.homeSubject.getValue()) {
        this.homeSubject.next(this.defaultHome);
      }
    });
  }

  setDescription(description: string) {
    setTimeout(() => {
      this.descriptionSubject.next(description);
    });
  }

  reset() {
    this.titleSubject.next('');
    this.breadcrumbItemsSubject.next([]);
    this.descriptionSubject.next('');
  }
}
