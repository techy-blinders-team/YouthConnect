package com.youthconnect.youthconnect_id.ratelimit;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/**
 * Annotation to apply rate limiting to controller methods
 */
@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
public @interface RateLimit {
    
    /**
     * Rate limit type (determines the limit configuration)
     */
    RateLimitType type();
    
    /**
     * Whether to use IP-based rate limiting (for unauthenticated endpoints)
     * If false, uses user-based rate limiting (requires authentication)
     */
    boolean useIpAddress() default false;
}
