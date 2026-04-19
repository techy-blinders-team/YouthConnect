package com.youthconnect.youthconnect_id.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

@Configuration
public class WebConfig {

    @Bean
    public CorsFilter corsFilter() {
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        CorsConfiguration config = new CorsConfiguration();

        config.setAllowCredentials(true);
        config.addAllowedOrigin("http://localhost:4200");
        config.addAllowedOrigin("http://localhost:8080");
        config.addAllowedOrigin("http://127.0.0.1:4200");
        config.addAllowedOrigin("http://127.0.0.1:8080");

        config.addAllowedHeader("*");
        config.addExposedHeader("Authorization");
        config.addExposedHeader("Content-Type");

        config.addAllowedMethod("GET");
        config.addAllowedMethod("POST");
        config.addAllowedMethod("PUT");
        config.addAllowedMethod("PATCH");
        config.addAllowedMethod("DELETE");
        config.addAllowedMethod("OPTIONS");

        source.registerCorsConfiguration("/api/**", config);

        return new CorsFilter(source);
    }
}