import { Component } from '@angular/core';
import { SideNavBar } from '../side-nav-bar/side-nav-bar';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sk-official-layout',
  standalone: true,
  imports: [SideNavBar, RouterOutlet, CommonModule],
  templateUrl: './sk-official-layout.html',
  styleUrls: ['./sk-official-layout.scss']
})
export class SkOfficialLayout {
  isSidebarOpen = false;

  toggleSidebar(): void {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  closeSidebar(): void {
    this.isSidebarOpen = false;
  }
}
