package com.youthconnect.youthconnect_id.controllers;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.youthconnect.youthconnect_id.dto.AdministratorCreateRequest;
import com.youthconnect.youthconnect_id.dto.AdministratorStatusUpdateRequest;
import com.youthconnect.youthconnect_id.dto.AdministratorUpdateRequest;
import com.youthconnect.youthconnect_id.services.AdminManagementService;

@RestController
@RequestMapping("/api/administrator/administrators")
public class AdminAdministratorController {

    @Autowired
    private AdminManagementService adminManagementService;

    @GetMapping("/count")
    public ResponseEntity<?> getAdministratorCount() {
        try {
            long count = adminManagementService.getAdministratorCount();
            return ResponseEntity.ok(Map.of("count", count));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed: " + e.getMessage());
        }
    }

    @GetMapping
    public ResponseEntity<?> getAllAdministrators() {
        try {
            return ResponseEntity.ok(adminManagementService.getAllAdministrators());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed: " + e.getMessage());
        }
    }

    @PostMapping
    public ResponseEntity<?> createAdministrator(@RequestBody AdministratorCreateRequest request) {
        try {
            return ResponseEntity.status(HttpStatus.CREATED).body(
                    adminManagementService.createAdministrator(
                            request.getUsername(),
                            request.getEmail(),
                            request.getPassword()));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Failed: " + e.getMessage()));
        }
    }

    @PutMapping("/{administratorId}")
    public ResponseEntity<?> updateAdministrator(
            @PathVariable int administratorId,
            @RequestBody AdministratorUpdateRequest request) {
        try {
            return ResponseEntity.ok(adminManagementService.updateAdministrator(
                    administratorId,
                    request.getUsername(),
                    request.getEmail(),
                    request.isActive(),
                    request.getPassword()));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", e.getMessage()));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Failed: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed: " + e.getMessage());
        }
    }

    @DeleteMapping("/{administratorId}")
    public ResponseEntity<?> deleteAdministrator(@PathVariable int administratorId) {
        try {
            adminManagementService.deleteAdministrator(administratorId);
            return ResponseEntity.ok(Map.of("message", "Administrator deleted successfully"));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Failed: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed: " + e.getMessage());
        }
    }

    @PatchMapping("/{administratorId}/status")
    public ResponseEntity<?> updateAdministratorStatus(
            @PathVariable int administratorId,
            @RequestBody AdministratorStatusUpdateRequest request) {
        try {
            return ResponseEntity.ok(
                    adminManagementService.setAdministratorActiveStatus(administratorId, request.isActive()));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Failed: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed: " + e.getMessage());
        }
    }
}
