package com.youthconnect.youthconnect_id.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.youthconnect.youthconnect_id.services.EmailService;

@RestController
@RequestMapping("/api/test")
public class EmailTestController {

    @Autowired
    private EmailService emailService;

    @GetMapping("/send-email")
    public ResponseEntity<String> testEmail(@RequestParam String email, @RequestParam String name) {
        try {
            System.out.println("=== EMAIL TEST ENDPOINT ===");
            System.out.println("Sending test email to: " + email);
            System.out.println("Name: " + name);
            
            emailService.sendRegistrationConfirmationEmail(email, name);
            
            return ResponseEntity.ok("Email sent successfully to " + email);
        } catch (Exception e) {
            System.err.println("Failed to send test email: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).body("Failed to send email: " + e.getMessage());
        }
    }
}
