package com.youthconnect.youthconnect_id.dto;

public class RsvpRequest {
    private int eventId;
    private int userId;

    public int getEventId() {
        return eventId; 
    }
    public void setEventId(int eventId) {
        this.eventId = eventId; 
    }
    public int getUserId() {
        return userId; 
    }
    public void setUserId(int userId) {
        this.userId = userId; 
    }
}