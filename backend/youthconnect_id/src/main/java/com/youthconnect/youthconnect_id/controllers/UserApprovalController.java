package com.youthconnect.youthconnect_id.controllers;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.youthconnect.youthconnect_id.dto.PendingUserResponse;
import com.youthconnect.youthconnect_id.services.UserApprovalService;

@RestController
@RequestMapping("/api/admin/users")
@CrossOrigin(origins = "http://localhost:4200")
public class UserApprovalController {

    @Autowired
    private UserApprovalService userApprovalService;

    @GetMapping("/pending")
    public ResponseEntity<?> getPendingUsers() {
        try {
            List<PendingUserResponse> pendingUsers = userApprovalService.getPendingUsers();
            return ResponseEntity.ok(pendingUsers);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to fetch pending users: " + e.getMessage()));
        }
    }

    @PostMapping("/{userId}/approve")
    public ResponseEntity<?> approveUser(
            @PathVariable int userId,
            @RequestBody(required = false) Map<String, Integer> body) {
        try {
            System.out.println("🔵 CONTROLLER: Approve endpoint called for userId=" + userId);
            
            // Get admin ID from request body (should come from JWT in production)
            int adminId = body != null && body.containsKey("adminId") ? body.get("adminId") : 1;
            
            System.out.println("🔵 CONTROLLER: Calling userApprovalService.approveUser()");
            boolean success = userApprovalService.approveUser(userId, adminId);
            System.out.println("🔵 CONTROLLER: approveUser() returned: " + success);
            
            if (success) {
                // Return the updated user object
                return ResponseEntity.ok(userApprovalService.getUserById(userId));
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("error", "User not found"));
            }
        } catch (Exception e) {
            System.err.println("🔴 CONTROLLER ERROR: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to approve user: " + e.getMessage()));
        }
    }

    @PostMapping("/{userId}/reject")
    public ResponseEntity<?> rejectUser(
            @PathVariable int userId,
            @RequestBody Map<String, String> body) {
        try {
            String reason = body.getOrDefault("reason", "Not specified");
            
            boolean success = userApprovalService.rejectUser(userId, reason);
            
            if (success) {
                // Return the updated user object
                return ResponseEntity.ok(userApprovalService.getUserById(userId));
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("error", "User not found"));
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to reject user: " + e.getMessage()));
        }
    }
}
