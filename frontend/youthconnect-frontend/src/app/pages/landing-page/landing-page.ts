import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NavigationBar } from "../../shared/navigation-bar/navigation-bar";

@Component({
  selector: 'app-landing-page',
  imports: [NavigationBar],
  templateUrl: './landing-page.html',
  styleUrl: './landing-page.scss',
})
export class LandingPage {
  constructor(private router: Router) { }

  navigateTo(route: string): void {
    this.router.navigate([route]);
  }
}
