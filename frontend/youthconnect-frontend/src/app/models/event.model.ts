export interface EventRequest {
  title: string;
  description?: string;
  eventDate: string; // format: YYYY-MM-DDTHH:mm:ss
  location?: string;
  createdByAdminId: number;
  status?: string;
}

export interface EventResponse {
  eventId: number;
  title: string;
  description?: string;
  eventDate: string;
  location?: string;
  createdByAdminId?: number;
  status?: string;
  createdAt: string;
  updatedAt?: string;
  rsvpCount?: number;
  expectedCount?: number;
}

export interface RsvpRequest {
  eventId: number;
  userId: number;
}

export interface AttendanceResponse {
  attendanceId: number;
  eventId: number;
  userId: number;
  isAttended: boolean;
  registeredAt: string;
  attendedAt?: string;
}

export interface MarkAttendanceRequest {
  userId: number;
}