import { Component } from '@angular/core';
import { Router, RouterLink } from "@angular/router";

@Component({
  selector: 'app-navigation-bar',
  imports: [RouterLink],
  templateUrl: './navigation-bar.html',
  styleUrl: './navigation-bar.scss',
})
export class NavigationBar {
  constructor(private router: Router) { }

  navigateTo(route: string): void {
    if (route === '/about') {
      // Check if we're on the landing page
      if (this.router.url === '/' || this.router.url === '') {
        // Scroll to about section
        const aboutSection = document.getElementById('about');
        if (aboutSection) {
          aboutSection.scrollIntoView({ behavior: 'smooth' });
        }
      } else {
        // Navigate to home and then scroll
        this.router.navigate(['/']).then(() => {
          setTimeout(() => {
            const aboutSection = document.getElementById('about');
            if (aboutSection) {
              aboutSection.scrollIntoView({ behavior: 'smooth' });
            }
          }, 100);
        });
      }
    } else {
      this.router.navigate([route]);
    }
  }
}
