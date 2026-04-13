import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EventService, EventResponse } from '../../../services/event.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule]
})
export class EventsComponent implements OnInit {
  isModalOpen = false;
  eventForm!: FormGroup;
  events: EventResponse[] = [];
  isLoading = false;
  errorMessage: string = '';
  successMessage: string = '';
  currentAdminId: number = 0;

  constructor(
    private fb: FormBuilder,
    private eventService: EventService,
    private authService: AuthService
  ) {
    this.initForm();
  }

  ngOnInit() {
    this.getCurrentUser();
    this.loadEvents();
  }

  initForm() {
    this.eventForm = this.fb.group({
      eventTitle: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      dateTime: ['', Validators.required],
      location: ['', [Validators.required, Validators.minLength(3)]]
    });
  }

  getCurrentUser() {
    const user = this.authService.getCurrentUser() as any;
    if (user && user.adminId) {
      this.currentAdminId = user.adminId;
    }
  }

  loadEvents() {
    this.isLoading = true;
    this.eventService.getAllEvents().subscribe({
      next: (data) => {
        this.events = data;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading events:', error);
        this.errorMessage = 'Failed to load events';
        this.isLoading = false;
      }
    });
  }

  openModal() {
    this.isModalOpen = true;
    this.eventForm.reset();
    this.errorMessage = '';
    this.successMessage = '';
  }

  closeModal() {
    this.isModalOpen = false;
    this.eventForm.reset();
    this.errorMessage = '';
    this.successMessage = '';
  }

  createEvent() {
    if (this.eventForm.invalid) {
      this.errorMessage = 'Please fill in all required fields correctly';
      return;
    }

    if (!this.currentAdminId) {
      this.errorMessage = 'User information not found. Please log in again.';
      return;
    }

    const formValue = this.eventForm.value;
    
    // Convert datetime-local to ISO format for backend
    const eventDate = new Date(formValue.dateTime).toISOString();

    const request = {
      title: formValue.eventTitle,
      description: formValue.description,
      eventDate: eventDate,
      location: formValue.location,
      createdByAdminId: this.currentAdminId,
      status: 'Upcoming'
    };

    this.isLoading = true;
    this.eventService.createEvent(request).subscribe({
      next: (response) => {
        this.successMessage = 'Event created successfully!';
        this.eventForm.reset();
        this.loadEvents();
        setTimeout(() => this.closeModal(), 1500);
      },
      error: (error) => {
        console.error('Error creating event:', error);
        this.errorMessage = error.error?.message || 'Failed to create event. Please try again.';
        this.isLoading = false;
      }
    });
  }

  deleteEvent(eventId: number) {
    if (confirm('Are you sure you want to delete this event?')) {
      this.eventService.deleteEvent(eventId).subscribe({
        next: () => {
          this.successMessage = 'Event deleted successfully!';
          this.loadEvents();
        },
        error: (error) => {
          console.error('Error deleting event:', error);
          this.errorMessage = 'Failed to delete event';
        }
      });
    }
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}
