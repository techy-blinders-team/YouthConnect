package com.youthconnect.youthconnect_id.services.implementation;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
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
import com.youthconnect.youthconnect_id.repositories.UserRepo;
import com.youthconnect.youthconnect_id.repositories.projection.EventRsvpCountProjection;
import com.youthconnect.youthconnect_id.services.EventService;

@Service
public class EventServiceImpl implements EventService {

    @Autowired
    private EventRepo eventRepo;

    @Autowired
    private EventAttendanceRepo eventAttendanceRepo;

    @Autowired
    private UserRepo userRepo;

    //Helpers
    private EventResponse toEventResponse(Event event, long rsvpCount) {
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
        response.setRsvpCount(rsvpCount);
        return response;
    }

    private Map<Integer, Long> getRsvpCountsByEventIds(List<Integer> eventIds) {
        if (eventIds == null || eventIds.isEmpty()) {
            return Collections.emptyMap();
        }

        Map<Integer, Long> counts = new HashMap<>();
        List<EventRsvpCountProjection> groupedCounts = eventAttendanceRepo.countRsvpsByEventIds(eventIds);
        for (EventRsvpCountProjection groupedCount : groupedCounts) {
            counts.put(groupedCount.getEventId(), groupedCount.getRsvpCount());
        }
        return counts;
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
        return toEventResponse(eventRepo.save(event), 0L);
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
        Event updated = eventRepo.save(event);
        long rsvpCount = eventAttendanceRepo.countByEventId(updated.getEventId());
        return toEventResponse(updated, rsvpCount);
    }

    @Override
    public void deleteEvent(int eventId) {
        Event event = eventRepo.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Event not found"));
        eventRepo.delete(event);
    }

    @Override
    public List<EventResponse> getAllEvents() {
        List<Event> events = eventRepo.findAll();
        Map<Integer, Long> rsvpCounts = getRsvpCountsByEventIds(events.stream().map(Event::getEventId).collect(Collectors.toList()));

        return events
                .stream()
                .sorted((e1, e2) -> e2.getCreatedAt().compareTo(e1.getCreatedAt())) // Latest first
            .map(event -> toEventResponse(event, rsvpCounts.getOrDefault(event.getEventId(), 0L)))
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
        long rsvpCount = eventAttendanceRepo.countByEventId(eventId);
        return toEventResponse(event, rsvpCount);
    }

    @Override
    @Transactional
    public AttendanceResponse rsvpEvent(RsvpRequest request) {
        // Check if already RSVP'd
        eventAttendanceRepo.findByEventIdAndUserId(request.getEventId(), request.getUserId())
                .ifPresent(a -> { throw new RuntimeException("Already RSVP'd to this event"); });

        // Check if event exists
        eventRepo.findById(request.getEventId())
                .orElseThrow(() -> new RuntimeException("Event not found"));

        // Check if user exists
        if (!userRepo.existsById(request.getUserId())) {
            throw new RuntimeException("User not found");
        }

        EventAttendance attendance = new EventAttendance();
        attendance.setEventId(request.getEventId());
        attendance.setUserId(request.getUserId());
        attendance.setAttended(false);
        attendance.setRegisteredAt(LocalDateTime.now());

        try {
            return toAttendanceResponse(eventAttendanceRepo.save(attendance));
        } catch (DataIntegrityViolationException ex) {
            // Handles race condition where duplicate RSVP is inserted concurrently.
            throw new RuntimeException("Already RSVP'd to this event");
        }
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