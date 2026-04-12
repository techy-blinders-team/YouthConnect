import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-concerns',
  imports: [CommonModule],
  templateUrl: './concerns.html',
  styleUrl: './concerns.scss',
})
export class Concerns {
  isResponseModalOpen = false;

  openResponseModal() {
    this.isResponseModalOpen = true;
  }

  closeResponseModal() {
    this.isResponseModalOpen = false;
  }

  sendResponse() {
    // TODO: Add response submission logic
    this.closeResponseModal();
  }
}
