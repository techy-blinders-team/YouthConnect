package com.youthconnect.youthconnect_id.services.implementation;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.youthconnect.youthconnect_id.dto.AttendanceResponse;
import com.youthconnect.youthconnect_id.dto.EventRequest;
import com.youthconnect.youthconnect_id.dto.EventResponse;
import com.youthconnect.youthconnect_id.dto.MarkAttendanceRequest;
import com.youthconnect.youthconnect_id.dto.RsvpRequest;
import com.youthconnect.youthconnect_id.models.Event;
import com.youthconnect.youthconnect_id.models.EventAttendance;
import com.youthconnect.youthconnect_id.repositories.EventAttendanceRepo;
import com.youthconnect.youthconnect_id.repositories.EventRepo;
import com.youthconnect.youthconnect_id.services.EventService;

@Service
public class EventServiceImpl implements EventService {

    @Autowired
    private EventRepo eventRepo;

    @Autowired
    private EventAttendanceRepo eventAttendanceRepo;

    //Helpers
    private EventResponse toEventResponse(Event event) {
        EventResponse response = new EventResponse();
        response.setEventId(event.getEventId());
        response.setTitle(event.getTitle());
        response.setDescription(event.getDescription());
        response.setEventDate(event.getEventDate());
        response.setLocation(event.getLocation());
        response.setCreatedByAdminId(event.getCreatedByAdminId());
        response.setStatus(event.getStatus());
        response.setCreatedAt(event.getCreatedAt());
        response.setUpdatedAt(event.getUpdatedAt());
        return response;
    }

    private AttendanceResponse toAttendanceResponse(EventAttendance attendance) {
        AttendanceResponse response = new AttendanceResponse();
        response.setAttendanceId(attendance.getAttendanceId());
        response.setEventId(attendance.getEventId());
        response.setUserId(attendance.getUserId());
        response.setAttended(attendance.isAttended());
        response.setRegisteredAt(attendance.getRegisteredAt());
        response.setAttendedAt(attendance.getAttendedAt());
        return response;
    }

    //SkOfficial
    @Override
    public EventResponse createEvent(EventRequest request) {
        Event event = new Event();
        event.setTitle(request.getTitle());
        event.setDescription(request.getDescription());
        event.setEventDate(request.getEventDate());
        event.setLocation(request.getLocation());
        event.setCreatedByAdminId(request.getCreatedByAdminId());
        event.setStatus(request.getStatus() != null ? request.getStatus() : "Upcoming");
        event.setCreatedAt(LocalDateTime.now());
        return toEventResponse(eventRepo.save(event));
    }

    @Override
    @Transactional
    public EventResponse editEvent(int eventId, EventRequest request) {
        Event event = eventRepo.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Event not found"));
        event.setTitle(request.getTitle());
        event.setDescription(request.getDescription());
        event.setEventDate(request.getEventDate());
        event.setLocation(request.getLocation());
        event.setStatus(request.getStatus());
        event.setUpdatedAt(LocalDateTime.now());
        return toEventResponse(eventRepo.save(event));
    }

    @Override
    public void deleteEvent(int eventId) {
        Event event = eventRepo.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Event not found"));
        eventRepo.delete(event);
    }

    @Override
    public List<EventResponse> getAllEvents() {
        return eventRepo.findAll()
                .stream()
                .map(this::toEventResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public AttendanceResponse markAttendance(int eventId, MarkAttendanceRequest request) {
        EventAttendance attendance = eventAttendanceRepo
                .findByEventIdAndUserId(eventId, request.getUserId())
                .orElseThrow(() -> new RuntimeException("RSVP not found for this user and event"));

        attendance.setAttended(true);
        attendance.setAttendedAt(LocalDateTime.now());
        return toAttendanceResponse(eventAttendanceRepo.save(attendance));
    }

    //Youth
    @Override
    public EventResponse getEventById(int eventId) {
        Event event = eventRepo.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Event not found"));
        return toEventResponse(event);
    }

    @Override
    public AttendanceResponse rsvpEvent(RsvpRequest request) {
        // Check if already RSVP'd
        eventAttendanceRepo.findByEventIdAndUserId(request.getEventId(), request.getUserId())
                .ifPresent(a -> { throw new RuntimeException("Already RSVP'd to this event"); });

        // Check if event exists
        eventRepo.findById(request.getEventId())
                .orElseThrow(() -> new RuntimeException("Event not found"));

        EventAttendance attendance = new EventAttendance();
        attendance.setEventId(request.getEventId());
        attendance.setUserId(request.getUserId());
        attendance.setAttended(false);
        attendance.setRegisteredAt(LocalDateTime.now());
        return toAttendanceResponse(eventAttendanceRepo.save(attendance));
    }

    @Override
    public void cancelRsvp(int eventId, int userId) {
        EventAttendance attendance = eventAttendanceRepo
                .findByEventIdAndUserId(eventId, userId)
                .orElseThrow(() -> new RuntimeException("RSVP not found"));
        eventAttendanceRepo.delete(attendance);
    }

    @Override
    public List<AttendanceResponse> getOwnRsvps(int userId) {
        return eventAttendanceRepo.findByUserId(userId)
                .stream()
                .map(this::toAttendanceResponse)
                .collect(Collectors.toList());
    }
}