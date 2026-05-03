package com.youthconnect.youthconnect_id.security;

import java.io.IOException;
import java.util.ArrayList;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    @Autowired
    private JwtUtil jwtUtil;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        
        try {
            String token = extractToken(request);
            
            if (token != null && jwtUtil.validateToken(token)) {
                String email = jwtUtil.extractEmail(token);
                Integer userId = jwtUtil.extractUserId(token);
                Integer roleId = jwtUtil.extractRoleId(token);
                
                if (email != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                    // Create authorities based on roleId
                    var authorities = new ArrayList<SimpleGrantedAuthority>();
                    
                    // Role mapping: 1=USER, 2=SK_OFFICIAL, 3=ADMIN
                    if (roleId != null) {
                        switch (roleId) {
                            case 1:
                                authorities.add(new SimpleGrantedAuthority("ROLE_USER"));
                                break;
                            case 2:
                                authorities.add(new SimpleGrantedAuthority("ROLE_SK_OFFICIAL"));
                                break;
                            case 3:
                                authorities.add(new SimpleGrantedAuthority("ROLE_ADMIN"));
                                break;
                        }
                    }
                    
                    UsernamePasswordAuthenticationToken authentication = 
                        new UsernamePasswordAuthenticationToken(email, null, authorities);
                    
                    authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    
                    // Store userId in authentication details for later use
                    request.setAttribute("userId", userId);
                    request.setAttribute("roleId", roleId);
                    
                    SecurityContextHolder.getContext().setAuthentication(authentication);
                }
            }
        } catch (Exception e) {
            logger.error("Cannot set user authentication: {}", e);
        }
        
        filterChain.doFilter(request, response);
    }
    
    private String extractToken(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        
        if (bearerToken != null && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        
        return null;
    }
}
