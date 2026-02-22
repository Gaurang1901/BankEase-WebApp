import { Component, inject, input, output } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { AuthStore } from '../../core/auth/store/auth.store';
import { NavigationStart, Router, RouterModule } from '@angular/router';
import { ThemeStore } from '../../core/store/theme/theme.store';
import { PageHeaderService } from '../../core/services/page-header.service';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { CommonModule } from '@angular/common';
import { MenuItem } from 'primeng/api';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  imports: [
    ButtonModule,
    CardModule,
    BreadcrumbModule,
    CommonModule,
    RouterModule,
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  readonly store = inject(AuthStore);
  readonly themeStore = inject(ThemeStore);
  private readonly router = inject(Router);
  private routerSubscription: Subscription;

  /** Passed from parent layout */
  isLeftSidebarCollapsed = input<boolean>(true);
  isMobile = input<boolean>(false);
  toggleSidebar = output<void>();

  private _pageHeaderService = inject(PageHeaderService);

  title$ = this._pageHeaderService.title$;
  description$ = this._pageHeaderService.description$;
  breadcrumbItems$ = this._pageHeaderService.breadcrumbItems$;
  home$: Observable<MenuItem | undefined> = this._pageHeaderService.home$;

  constructor() {
    this.routerSubscription = this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        this.onRouteChange();
      }
    });
  }

  toggleDarkMode() {
    this.themeStore.toggleTheme();
  }

  logout() {
    this.store.logout();
    this.router.navigateByUrl('/login');
  }

  handleClick(item: any) {
    if (item?.onClick) {
      return item.onClick();
    }
    return;
  }

  ngOnDestroy() {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

  onRouteChange() {
    this._pageHeaderService.setTitle('');
    this._pageHeaderService.setBreadcrumb([]);
    this._pageHeaderService.setDescription('');
  }
}
