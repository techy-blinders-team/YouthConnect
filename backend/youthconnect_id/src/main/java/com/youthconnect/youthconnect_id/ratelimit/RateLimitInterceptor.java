package com.youthconnect.youthconnect_id.ratelimit;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.method.HandlerMethod;
import org.springframework.web.servlet.HandlerInterceptor;

/**
 * Interceptor to enforce rate limiting on controller methods
 */
@Component
public class RateLimitInterceptor implements HandlerInterceptor {
    
    @Autowired
    private RateLimitService rateLimitService;
    
    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        if (!(handler instanceof HandlerMethod)) {
            return true;
        }
        
        HandlerMethod handlerMethod = (HandlerMethod) handler;
        RateLimit rateLimit = handlerMethod.getMethodAnnotation(RateLimit.class);
        
        if (rateLimit == null) {
            return true; // No rate limit annotation, allow request
        }
        
        String key = resolveKey(request, rateLimit);
        RateLimitType type = rateLimit.type();
        
        if (!rateLimitService.tryConsume(key, type)) {
            response.setStatus(HttpStatus.TOO_MANY_REQUESTS.value());
            response.setContentType("application/json");
            response.getWriter().write(String.format(
                "{\"error\": \"Rate limit exceeded\", \"message\": \"Too many requests. Please try again later.\", \"limit\": \"%s requests per %s seconds\"}",
                type.getRequests(),
                type.getDurationSeconds()
            ));
            return false;
        }
        
        // Add rate limit headers
        long availableTokens = rateLimitService.getAvailableTokens(key, type);
        response.setHeader("X-RateLimit-Limit", String.valueOf(type.getRequests()));
        response.setHeader("X-RateLimit-Remaining", String.valueOf(availableTokens));
        
        return true;
    }
    
    /**
     * Resolve the key for rate limiting based on IP or user ID
     */
    private String resolveKey(HttpServletRequest request, RateLimit rateLimit) {
        if (rateLimit.useIpAddress()) {
            return getClientIpAddress(request) + ":" + rateLimit.type().name();
        } else {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            if (authentication != null && authentication.isAuthenticated() && 
                !authentication.getPrincipal().equals("anonymousUser")) {
                String username = authentication.getName();
                return "user:" + username + ":" + rateLimit.type().name();
            }
            // Fallback to IP if user is not authenticated
            return getClientIpAddress(request) + ":" + rateLimit.type().name();
        }
    }
    
    /**
     * Get the client's IP address from the request
     */
    private String getClientIpAddress(HttpServletRequest request) {
        String xForwardedFor = request.getHeader("X-Forwarded-For");
        if (xForwardedFor != null && !xForwardedFor.isEmpty()) {
            return xForwardedFor.split(",")[0].trim();
        }
        
        String xRealIp = request.getHeader("X-Real-IP");
        if (xRealIp != null && !xRealIp.isEmpty()) {
            return xRealIp;
        }
        
        return request.getRemoteAddr();
    }
}
