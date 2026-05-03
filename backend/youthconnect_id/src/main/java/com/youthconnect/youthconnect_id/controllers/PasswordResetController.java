package com.youthconnect.youthconnect_id.controllers;

import org.springframework.beans.factory.annotation.Autowired;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.youthconnect.youthconnect_id.dto.ForgotPasswordRequest;
import com.youthconnect.youthconnect_id.dto.ResetPasswordRequest;
import com.youthconnect.youthconnect_id.services.PasswordResetService;

@RestController
@RequestMapping("/api/password-reset")
public class PasswordResetController {

    @Autowired
    private PasswordResetService passwordResetService;

    @PostMapping("/forgot-password")
    public ResponseEntity<Map<String, Object>> forgotPassword(@RequestBody ForgotPasswordRequest request) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            passwordResetService.initiatePasswordReset(request.getEmail(), false);
            response.put("success", true);
            response.put("message", "If an account exists with this email, a password reset link has been sent.");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "An error occurred. Please try again later.");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    @PostMapping("/reset-password")
    public ResponseEntity<Map<String, Object>> resetPassword(@RequestBody ResetPasswordRequest request) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            passwordResetService.resetPassword(request.getToken(), request.getNewPassword(), false);
            response.put("success", true);
            response.put("message", "Password has been reset successfully. You can now login with your new password.");
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "An error occurred. Please try again later.");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    @GetMapping("/validate-token")
    public ResponseEntity<Map<String, Object>> validateToken(@RequestParam String token) {
        Map<String, Object> response = new HashMap<>();
        
        boolean isValid = passwordResetService.validateResetToken(token, false);
        response.put("valid", isValid);
        
        if (!isValid) {
            response.put("message", "Invalid or expired reset token");
        }
        
        return ResponseEntity.ok(response);
    }

    // SK Official endpoints
    @PostMapping("/sk-official/forgot-password")
    public ResponseEntity<Map<String, Object>> skOfficialForgotPassword(@RequestBody ForgotPasswordRequest request) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            passwordResetService.initiatePasswordReset(request.getEmail(), true);
            response.put("success", true);
            response.put("message", "If an account exists with this email, a password reset link has been sent.");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "An error occurred. Please try again later.");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    @PostMapping("/sk-official/reset-password")
    public ResponseEntity<Map<String, Object>> skOfficialResetPassword(@RequestBody ResetPasswordRequest request) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            passwordResetService.resetPassword(request.getToken(), request.getNewPassword(), true);
            response.put("success", true);
            response.put("message", "Password has been reset successfully. You can now login with your new password.");
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "An error occurred. Please try again later.");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    @GetMapping("/sk-official/validate-token")
    public ResponseEntity<Map<String, Object>> skOfficialValidateToken(@RequestParam String token) {
        Map<String, Object> response = new HashMap<>();
        
        boolean isValid = passwordResetService.validateResetToken(token, true);
        response.put("valid", isValid);
        
        if (!isValid) {
            response.put("message", "Invalid or expired reset token");
        }
        
        return ResponseEntity.ok(response);
    }
}
