import { Component } from '@angular/core';
import { SideNavBar } from '../side-nav-bar/side-nav-bar';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-sk-official-layout',
  standalone: true,
  imports: [SideNavBar, RouterOutlet],
  templateUrl: './sk-official-layout.html',
  styleUrls: ['./sk-official-layout.scss']
})
export class SkOfficialLayout {}
