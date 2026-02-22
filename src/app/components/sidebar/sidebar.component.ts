import {
  Component,
  computed,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';

import { AuthStore } from '../../core/auth/store/auth.store';
import { PermissionRequirement } from '../../core/utils/role';
import { sideBarItems } from '../../core/utils/sidebar.data';
import { TooltipModule } from 'primeng/tooltip';

export type MasterSidebarItem = {
  routeLink?: string;
  icon: string;
  label: string;
  permission?: PermissionRequirement;
  children?: MasterSidebarItem[];
};

export type DisplaySidebarItem = MasterSidebarItem & {
  level: number;
  isParent: boolean;
  expanded?: boolean;
};

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule, ButtonModule, TooltipModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent {
  isLeftSidebarCollapsed = input.required<boolean>();
  isMobile = input<boolean>(false);
  changeIsLeftSidebarCollapsed = output<boolean>();
  allItems: MasterSidebarItem[] = [];

  private readonly authStore = inject(AuthStore);
  private expandedMenus = signal<Set<string>>(new Set());

  constructor() {
    this.allItems = sideBarItems;
  }

  items = computed(() => {
    const permittedItems: DisplaySidebarItem[] = [];
    const expanded = this.expandedMenus();

    const processItems = (items: MasterSidebarItem[], level: number): void => {
      for (const item of items) {
        const hasPermission =
          !item.permission ||
          this.authStore.hasPermission()(
            item.permission.resource,
            item.permission.action,
          );

        if (!hasPermission) continue;

        const isParent = !!item.children?.length;
        const isExpanded = isParent && expanded.has(item.label);

        permittedItems.push({
          ...item,
          level,
          isParent,
          expanded: isExpanded,
        });

        if (isExpanded && item.children) {
          processItems(item.children, level + 1);
        }
      }
    };

    processItems(this.allItems, 0);
    return permittedItems;
  });

  handleItemClick(item: DisplaySidebarItem): void {
    if (item.isParent) {
      this.expandedMenus.update((current) => {
        const updated = new Set(current);
        updated.has(item.label)
          ? updated.delete(item.label)
          : updated.add(item.label);
        return updated;
      });
    } else if (item.routeLink !== undefined) {
      // On mobile, always close after navigation
      if (this.isMobile()) {
        this.closeSidenav();
      }
    }
  }

  toggleCollapse(): void {
    this.changeIsLeftSidebarCollapsed.emit(!this.isLeftSidebarCollapsed());
  }

  closeSidenav(): void {
    this.changeIsLeftSidebarCollapsed.emit(true);
  }
}
