import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { EventService, EventResponse } from '../../../services/event.service';
import { AuthService } from '../../../services/auth.service';
import { SkOfficialManagementService } from '../../../services/sk-official-management.service';

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule]
})
export class EventsComponent implements OnInit {
  isModalOpen = false;
  eventForm!: FormGroup;
  events: EventResponse[] = [];
  filteredEvents: EventResponse[] = [];
  isLoading = false;
  errorMessage: string = '';
  successMessage: string = '';
  currentAdminId: number = 0;
  editingEventId: number | null = null;
  searchTerm: string = '';
  skOfficialName = 'SK Official';
  skOfficialEmail = '';
  skOfficialPosition = 'SK Official';
  skOfficialInitials = 'SK';
  notifications: { id: number; message: string; type: 'success' | 'error' }[] = [];
  private notificationCounter = 0;
  isDeleteConfirmationModalOpen = false;
  pendingDeleteEvent: EventResponse | null = null;
  isEditConfirmationModalOpen = false;
  pendingEditPayload: any = null;

  constructor(
    private fb: FormBuilder,
    private eventService: EventService,
    private authService: AuthService,
    private skOfficialService: SkOfficialManagementService
  ) {
    this.initForm();
  }

  ngOnInit() {
    this.getCurrentUser();
    this.loadSkOfficialProfile();
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
      localStorage.setItem('adminId', user.adminId.toString());
    }

    if (!this.currentAdminId) {
      const storedAdminId = localStorage.getItem('sk_official_id') || localStorage.getItem('adminId');
      this.currentAdminId = storedAdminId ? Number(storedAdminId) : 0;
    }
  }

  loadSkOfficialProfile() {
    const fallbackName = localStorage.getItem('sk_official_name') || 'SK Official';
    const fallbackEmail = localStorage.getItem('sk_official_email') || '';
    const fallbackInitials = this.getInitials(fallbackName);
    const currentAdminId = Number(localStorage.getItem('sk_official_id') || localStorage.getItem('adminId'));

    this.skOfficialName = fallbackName;
    this.skOfficialEmail = fallbackEmail;
    this.skOfficialInitials = fallbackInitials;

    this.skOfficialService.getSkOfficials().subscribe({
      next: (officials) => {
        const matched = officials.find((official) => official.adminId === currentAdminId)
          || officials.find((official) => official.email === fallbackEmail);

        if (!matched) {
          return;
        }

        this.skOfficialName = `${matched.firstName} ${matched.lastName}`.trim();
        this.skOfficialEmail = matched.email;
        this.skOfficialInitials = this.getInitials(this.skOfficialName);
        localStorage.setItem('sk_official_name', this.skOfficialName);
        localStorage.setItem('sk_official_email', matched.email);
      },
      error: (error) => {
        console.error('Error loading SK Official profile:', error);
      }
    });
  }

  getInitials(name: string): string {
    const parts = name.split(' ').filter(Boolean);
    if (parts.length === 0) {
      return 'SK';
    }
    if (parts.length === 1) {
      return parts[0].substring(0, 2).toUpperCase();
    }
    return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
  }

  loadEvents() {
    this.isLoading = true;
    this.eventService.getAllEvents().subscribe({
      next: (data) => {
        this.events = data;
        this.filteredEvents = data;
        this.searchTerm = '';
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading events:', error);
        this.errorMessage = 'Failed to load events';
        this.isLoading = false;
      }
    });
  }

  searchEvents(term: string) {
    this.searchTerm = term;
    
    if (!term.trim()) {
      this.filteredEvents = this.events;
      return;
    }

    const searchLower = term.toLowerCase();
    this.filteredEvents = this.events.filter(event =>
      event.title.toLowerCase().includes(searchLower) ||
      event.description.toLowerCase().includes(searchLower) ||
      event.location.toLowerCase().includes(searchLower)
    );
  }

  openModal() {
    this.isModalOpen = true;
    this.editingEventId = null;
    this.eventForm.reset();
    this.errorMessage = '';
    this.successMessage = '';
  }

  editEvent(event: EventResponse) {
    this.isModalOpen = true;
    this.editingEventId = event.eventId;
    this.errorMessage = '';
    this.successMessage = '';

    // Convert ISO date to datetime-local format
    const dateObj = new Date(event.eventDate);
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const day = String(dateObj.getDate()).padStart(2, '0');
    const hours = String(dateObj.getHours()).padStart(2, '0');
    const minutes = String(dateObj.getMinutes()).padStart(2, '0');
    const dateTimeLocal = `${year}-${month}-${day}T${hours}:${minutes}`;

    this.eventForm.patchValue({
      eventTitle: event.title,
      description: event.description,
      dateTime: dateTimeLocal,
      location: event.location
    });
  }

  closeModal() {
    this.isModalOpen = false;
    this.editingEventId = null;
    this.eventForm.reset();
    this.errorMessage = '';
    this.successMessage = '';
  }

  submitEvent() {
    if (this.editingEventId) {
      // Show confirmation modal for edit
      if (this.eventForm.invalid) {
        this.errorMessage = 'Please fill in all required fields correctly';
        return;
      }

      const formValue = this.eventForm.value;
      const eventDate = new Date(formValue.dateTime).toISOString();

      this.pendingEditPayload = {
        title: formValue.eventTitle,
        description: formValue.description,
        eventDate: eventDate,
        location: formValue.location,
        createdByAdminId: this.currentAdminId,
        status: 'Upcoming'
      };

      this.isEditConfirmationModalOpen = true;
    } else {
      this.createEvent();
    }
  }

  private showNotification(message: string, type: 'success' | 'error' = 'success'): void {
    const id = ++this.notificationCounter;
    this.notifications = [...this.notifications, { id, message, type }];

    setTimeout(() => {
      this.notifications = this.notifications.filter(notification => notification.id !== id);
    }, 3000);
  }

  saveEditedEvent() {
    if (this.eventForm.invalid) {
      this.errorMessage = 'Please fill in all required fields correctly';
      return;
    }

    if (!this.editingEventId) {
      this.errorMessage = 'Event ID not found';
      return;
    }

    const formValue = this.eventForm.value;
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
    this.eventService.editEvent(this.editingEventId, request).subscribe({
      next: () => {
        this.successMessage = '';
        this.showNotification('Event updated successfully!');
        this.eventForm.reset();
        this.editingEventId = null;
        this.loadEvents();
        this.closeModal();
      },
      error: (error) => {
        console.error('Error updating event:', error);
        this.errorMessage = error.error?.message || 'Failed to update event. Please try again.';
        this.isLoading = false;
      }
    });
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
      next: () => {
        this.successMessage = '';
        this.showNotification('Event created successfully!');
        this.eventForm.reset();
        this.loadEvents();
        this.closeModal();
      },
      error: (error) => {
        console.error('Error creating event:', error);
        this.errorMessage = error.error?.message || 'Failed to create event. Please try again.';
        this.isLoading = false;
      }
    });
  }

  deleteEvent(event: EventResponse) {
    this.pendingDeleteEvent = event;
    this.isDeleteConfirmationModalOpen = true;
  }

  closeDeleteConfirmationModal(): void {
    this.isDeleteConfirmationModalOpen = false;
    this.pendingDeleteEvent = null;
  }

  confirmDeleteSubmission(): void {
    if (!this.pendingDeleteEvent) {
      return;
    }

    this.isLoading = true;

    this.eventService.deleteEvent(this.pendingDeleteEvent.eventId).subscribe({
      next: () => {
        this.showNotification('Event deleted successfully!');
        this.isLoading = false;
        this.closeDeleteConfirmationModal();
        this.loadEvents();
      },
      error: (error) => {
        console.error('Error deleting event:', error);
        this.errorMessage = 'Failed to delete event';
        this.isLoading = false;
      }
    });
  }

  closeEditConfirmationModal(): void {
    this.isEditConfirmationModalOpen = false;
    this.pendingEditPayload = null;
  }

  confirmEditSubmission(): void {
    if (!this.pendingEditPayload || !this.editingEventId) {
      return;
    }

    this.isLoading = true;

    this.eventService.editEvent(this.editingEventId, this.pendingEditPayload).subscribe({
      next: () => {
        this.showNotification('Event updated successfully!');
        this.isLoading = false;
        this.closeEditConfirmationModal();
        this.eventForm.reset();
        this.editingEventId = null;
        this.loadEvents();
        this.closeModal();
      },
      error: (error) => {
        console.error('Error updating event:', error);
        this.errorMessage = error.error?.message || 'Failed to update event. Please try again.';
        this.isLoading = false;
      }
    });
  }

  isEventOngoing(status?: string): boolean {
    return (status || '').toLowerCase() === 'ongoing';
  }

  isEditDisabled(status?: string): boolean {
    const normalizedStatus = (status || '').toLowerCase();
    return normalizedStatus === 'ongoing' || normalizedStatus === 'completed';
  }

  getStatusActionLabel(status?: string): string {
    const normalizedStatus = (status || 'Upcoming').toLowerCase();

    if (normalizedStatus === 'upcoming') {
      return 'Set as Ongoing';
    }

    if (normalizedStatus === 'ongoing') {
      return 'Set as Completed';
    }

    return 'Completed';
  }

  getStatusActionClass(status?: string): string {
    const normalizedStatus = (status || 'Upcoming').toLowerCase();

    if (normalizedStatus === 'upcoming') {
      return 'ongoing-action';
    }

    if (normalizedStatus === 'ongoing') {
      return 'completed-action';
    }

    return 'disabled-completed';
  }

  isStatusActionDisabled(status?: string): boolean {
    return (status || '').toLowerCase() === 'completed' || this.isLoading;
  }

  updateEventStatus(event: EventResponse) {
    if (this.isStatusActionDisabled(event.status)) {
      return;
    }

    const currentStatus = (event.status || 'Upcoming').toLowerCase();
    const nextStatus = currentStatus === 'upcoming' ? 'Ongoing' : 'Completed';

    const request = {
      title: event.title,
      description: event.description,
      eventDate: event.eventDate,
      location: event.location,
      createdByAdminId: event.createdByAdminId,
      status: nextStatus
    };

    this.isLoading = true;
    this.errorMessage = '';

    this.eventService.editEvent(event.eventId, request).subscribe({
      next: () => {
        // Update the event in the local arrays
        const index = this.events.findIndex(e => e.eventId === event.eventId);
        if (index !== -1) {
          this.events[index].status = nextStatus;
          this.filteredEvents = [...this.events];
        }
        
        this.showNotification(`Event status updated to ${nextStatus}`);
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error updating event status:', error);
        this.showNotification(error.error?.message || 'Failed to update event status', 'error');
        this.isLoading = false;
      }
    });
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
