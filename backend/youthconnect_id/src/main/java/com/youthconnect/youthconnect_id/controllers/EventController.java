package com.youthconnect.youthconnect_id.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.youthconnect.youthconnect_id.dto.AttendanceResponse;
import com.youthconnect.youthconnect_id.dto.EventResponse;
import com.youthconnect.youthconnect_id.dto.RsvpRequest;
import com.youthconnect.youthconnect_id.services.EventService;

@RestController
@RequestMapping("/api/events")
public class EventController {

    @Autowired
    private EventService eventService;

    @GetMapping
    public ResponseEntity<?> getAllEvents() {
        try {
            List<EventResponse> events = eventService.getAllEvents();
            return ResponseEntity.ok(events);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed: " + e.getMessage());
        }
    }

    @GetMapping("/{eventId}")
    public ResponseEntity<?> getEventById(@PathVariable int eventId) {
        try {
            return ResponseEntity.ok(eventService.getEventById(eventId));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Failed: " + e.getMessage());
        }
    }

    @PostMapping("/rsvp")
    public ResponseEntity<?> rsvpEvent(@RequestBody RsvpRequest request) {
        try {
            return ResponseEntity.status(HttpStatus.CREATED).body(eventService.rsvpEvent(request));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Failed: " + e.getMessage());
        }
    }

    @DeleteMapping("/{eventId}/rsvp/{userId}")
    public ResponseEntity<?> cancelRsvp(@PathVariable int eventId,
            @PathVariable int userId) {
        try {
            eventService.cancelRsvp(eventId, userId);
            return ResponseEntity.ok("RSVP cancelled successfully");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Failed: " + e.getMessage());
        }
    }

    @GetMapping("/rsvp/user/{userId}")
    public ResponseEntity<?> getOwnRsvps(@PathVariable int userId) {
        try {
            List<AttendanceResponse> rsvps = eventService.getOwnRsvps(userId);
            return ResponseEntity.ok(rsvps);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed: " + e.getMessage());
        }
    }
}