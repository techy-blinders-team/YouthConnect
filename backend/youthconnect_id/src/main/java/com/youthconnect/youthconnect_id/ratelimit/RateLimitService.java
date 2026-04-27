package com.youthconnect.youthconnect_id.ratelimit;

import io.github.bucket4j.Bandwidth;
import io.github.bucket4j.Bucket;
import io.github.bucket4j.Refill;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Service to manage rate limiting using Bucket4j
 */
@Service
public class RateLimitService {
    
    private final Map<String, Bucket> cache = new ConcurrentHashMap<>();
    
    /**
     * Resolve a bucket for the given key and rate limit type
     * 
     * @param key Unique identifier (IP address or user ID)
     * @param type Rate limit type
     * @return Bucket for rate limiting
     */
    public Bucket resolveBucket(String key, RateLimitType type) {
        return cache.computeIfAbsent(key, k -> createNewBucket(type));
    }
    
    /**
     * Create a new bucket with the specified rate limit configuration
     * 
     * @param type Rate limit type
     * @return New bucket instance
     */
    private Bucket createNewBucket(RateLimitType type) {
        Bandwidth limit = Bandwidth.classic(
            type.getRequests(),
            Refill.intervally(type.getRequests(), Duration.ofSeconds(type.getDurationSeconds()))
        );
        return Bucket.builder()
            .addLimit(limit)
            .build();
    }
    
    /**
     * Check if a request is allowed for the given key and type
     * 
     * @param key Unique identifier
     * @param type Rate limit type
     * @return true if request is allowed, false otherwise
     */
    public boolean tryConsume(String key, RateLimitType type) {
        Bucket bucket = resolveBucket(key, type);
        return bucket.tryConsume(1);
    }
    
    /**
     * Get the number of available tokens for the given key and type
     * 
     * @param key Unique identifier
     * @param type Rate limit type
     * @return Number of available tokens
     */
    public long getAvailableTokens(String key, RateLimitType type) {
        Bucket bucket = resolveBucket(key, type);
        return bucket.getAvailableTokens();
    }
}
