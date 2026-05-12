package com.youthconnect.youthconnect_id.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import com.youthconnect.youthconnect_id.security.JwtAuthenticationFilter;

import java.util.Arrays;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Autowired
    private JwtAuthenticationFilter jwtAuthenticationFilter;

    @Bean
    public BCryptPasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .csrf(csrf -> csrf.disable())
            .authorizeHttpRequests(auth -> auth
                // Public endpoints - No authentication required
                .requestMatchers("/api/auth/login").permitAll()
                .requestMatchers("/api/auth/register").permitAll()
                .requestMatchers("/api/admin/auth/**").permitAll()
                .requestMatchers("/api/password-reset/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/concerns/*/updates").permitAll()
                
                // Admin endpoints
                .requestMatchers("/api/admin/users/**").hasAnyRole("ADMIN", "SK_OFFICIAL")
                .requestMatchers("/api/admin/concerns/**").hasAnyRole("ADMIN", "SK_OFFICIAL")
                .requestMatchers("/api/administrator/**").hasAnyRole("ADMIN", "SK_OFFICIAL")
                
                // SK Official endpoints
                .requestMatchers("/api/sk/events").authenticated()
                .requestMatchers("/api/sk/**").hasAnyRole("SK_OFFICIAL", "ADMIN")
                
                // Protected endpoints
                .requestMatchers("/api/concerns/**").authenticated()
                .requestMatchers("/api/events/**").authenticated()
                .requestMatchers("/api/notifications/**").authenticated()
                
                // Test endpoints - REMOVE IN PRODUCTION
                .requestMatchers("/api/test/**").permitAll()
                .requestMatchers("/api/email-test/**").permitAll()
                .requestMatchers("/api/debug/**").permitAll()
                
                // All other requests
                .anyRequest().authenticated()
            )
            .sessionManagement(session -> session
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            )
            .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        
        // Allow all your origins including production
        configuration.setAllowedOrigins(Arrays.asList(
            "http://localhost:4200",
            "http://localhost:3000",
            "http://localhost:8080",
            "http://127.0.0.1:4200",
            "http://127.0.0.1:8080",
            "https://sk183pasay.site"  // ✅ ADD YOUR PRODUCTION DOMAIN
        ));
        
        configuration.setAllowedMethods(Arrays.asList(
            "GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"
        ));
        
        configuration.setAllowedHeaders(Arrays.asList(
            "Authorization",
            "Content-Type",
            "X-Requested-With",
            "Accept",
            "Origin",
            "Access-Control-Request-Method",
            "Access-Control-Request-Headers"
        ));
        
        configuration.setAllowCredentials(true);
        configuration.setMaxAge(3600L);
        
        configuration.setExposedHeaders(Arrays.asList(
            "Authorization",
            "Content-Disposition"
        ));
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        
        return source;
    }
}