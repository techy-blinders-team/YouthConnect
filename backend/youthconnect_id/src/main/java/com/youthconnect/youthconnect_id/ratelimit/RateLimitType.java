package com.youthconnect.youthconnect_id.ratelimit;

/**
 * Enum defining different rate limit types with their configurations
 */
public enum RateLimitType {
    /**
     * Login attempts: 5 attempts per 15 minutes per IP
     */
    LOGIN(5, 15 * 60),
    
    /**
     * Registration: 3 attempts per hour per IP
     */
    REGISTRATION(3, 60 * 60),
    
    /**
     * Create concern: 10 concerns per hour per user
     */
    CREATE_CONCERN(10, 60 * 60),
    
    /**
     * RSVP to events: 20 RSVPs per hour per user
     */
    RSVP_EVENT(20, 60 * 60),
    
    /**
     * General API calls: 100 requests per minute per user
     */
    GENERAL_API(100, 60);
    
    private final int requests;
    private final int durationSeconds;
    
    RateLimitType(int requests, int durationSeconds) {
        this.requests = requests;
        this.durationSeconds = durationSeconds;
    }
    
    public int getRequests() {
        return requests;
    }
    
    public int getDurationSeconds() {
        return durationSeconds;
    }
}
