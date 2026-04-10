import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface YouthEvent {
    id: number;
    title: string;
    description: string;
    color: 'red' | 'blue' | 'yellow';
    rsvpStatus: 'pending' | 'confirmed';
}

@Component({
    selector: 'app-event',
    imports: [CommonModule],
    templateUrl: './event.html',
    styleUrl: './event.scss',
})
export class EventPage {
    showRsvpModal = false;
    selectedEvent: YouthEvent | null = null;

    events: YouthEvent[] = [
        {
            id: 1,
            title: 'Gender Sensitivity',
            description: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat',
            color: 'red',
            rsvpStatus: 'pending'
        },
        {
            id: 2,
            title: 'Gender Sensitivity',
            description: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat',
            color: 'blue',
            rsvpStatus: 'pending'
        },
        {
            id: 3,
            title: 'Gender Sensitivity',
            description: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat',
            color: 'yellow',
            rsvpStatus: 'pending'
        }
    ];

    rsvpEvent(event: YouthEvent) {
        if (event.rsvpStatus === 'pending') {
            this.selectedEvent = event;
            this.showRsvpModal = true;

            // Confirm RSVP immediately
            event.rsvpStatus = 'confirmed';
            console.log('RSVP confirmed for event:', event);
            // TODO: Call API to confirm RSVP

            // Auto-close modal after 2.5 seconds
            setTimeout(() => {
                this.closeRsvpModal();
            }, 2500);
        }
    }

    closeRsvpModal() {
        this.showRsvpModal = false;
        this.selectedEvent = null;
    }
}
