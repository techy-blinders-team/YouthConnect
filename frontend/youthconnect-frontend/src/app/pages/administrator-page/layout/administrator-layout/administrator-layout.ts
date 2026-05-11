
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AdministratorSidebar } from '../administrator-sidebar/administrator-sidebar';

@Component({
  selector: 'app-administrator-layout',
  standalone: true,
  imports: [RouterOutlet, AdministratorSidebar],
  templateUrl: './administrator-layout.html',
  styleUrl: './administrator-layout.scss',
})
export class AdministratorLayout {
  isSidebarOpen = false;

  toggleSidebar(): void {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  closeSidebar(): void {
    this.isSidebarOpen = false;
  }
}
