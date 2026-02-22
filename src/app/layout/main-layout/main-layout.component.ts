import {
  Component,
  computed,
  HostListener,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { HeaderComponent } from '../../components/header/header.component';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/auth/services/auth.service';

const MOBILE_BREAKPOINT = 768;

@Component({
  selector: 'app-main-layout',
  imports: [RouterOutlet, HeaderComponent, SidebarComponent, CommonModule],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.scss',
})
export class MainLayoutComponent implements OnInit {
  isLeftSidebarCollapsed = signal<boolean>(true);
  screenWidth = signal<number>(window.innerWidth);
  authService = inject(AuthService);

  isMobile = computed(() => this.screenWidth() < MOBILE_BREAKPOINT);

  @HostListener('window:resize')
  onResize() {
    this.screenWidth.set(window.innerWidth);
    // Auto-collapse on mobile when resizing down
    if (this.isMobile()) {
      this.isLeftSidebarCollapsed.set(true);
    }
  }

  ngOnInit(): void {
    this.authService.sayHello();
    // Ensure sidebar is collapsed on initial mobile load
    if (this.isMobile()) {
      this.isLeftSidebarCollapsed.set(true);
    }
  }

  changeIsLeftSidebarCollapsed(isLeftSidebarCollapsed: boolean): void {
    this.isLeftSidebarCollapsed.set(isLeftSidebarCollapsed);
  }

  /** On desktop: push body to the right. On mobile: sidebar overlays, body is always full width. */
  screenClass = computed(() => {
    if (this.isMobile()) {
      return ''; // full width always on mobile; sidebar is an overlay
    }
    return this.isLeftSidebarCollapsed() ? '' : 'body-trimmed';
  });
}
