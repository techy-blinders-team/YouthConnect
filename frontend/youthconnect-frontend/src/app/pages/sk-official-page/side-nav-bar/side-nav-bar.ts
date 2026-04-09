import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-side-nav-bar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './side-nav-bar.html',
  styleUrl: './side-nav-bar.scss'
})
export class SideNavBar {}