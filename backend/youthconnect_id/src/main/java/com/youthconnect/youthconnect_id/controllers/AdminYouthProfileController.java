package com.youthconnect.youthconnect_id.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.youthconnect.youthconnect_id.dto.AdminYouthProfileUpdateRequest;
import com.youthconnect.youthconnect_id.services.AdminManagementService;

@RestController
@RequestMapping("/api/administrator/youth-profiles")
public class AdminYouthProfileController {

    @Autowired
    private AdminManagementService adminManagementService;

    @GetMapping
    public ResponseEntity<?> getAllYouthProfiles() {
        try {
            return ResponseEntity.ok(adminManagementService.getAllYouthProfiles());
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed: " + e.getMessage());
        }
    }

    @GetMapping("/{youthId}")
    public ResponseEntity<?> getYouthProfileById(@PathVariable int youthId) {
        try {
            return ResponseEntity.ok(adminManagementService.getYouthProfileById(youthId));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Failed: " + e.getMessage());
        }
    }

    @PutMapping("/{youthId}")
    public ResponseEntity<?> updateYouthProfile(@PathVariable int youthId,
            @RequestBody AdminYouthProfileUpdateRequest request) {
        try {
            return ResponseEntity.ok(adminManagementService.updateYouthProfile(youthId, request));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Failed: " + e.getMessage());
        }
    }

    @PutMapping("/{youthId}/deactivate")
    public ResponseEntity<?> deactivateYouthProfile(@PathVariable int youthId) {
        try {
            return ResponseEntity.ok(adminManagementService.deactivateYouthProfile(youthId));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Failed: " + e.getMessage());
        }
    }

    @DeleteMapping("/{youthId}")
    public ResponseEntity<?> deleteYouthProfile(@PathVariable int youthId) {
        try {
            adminManagementService.deleteYouthProfile(youthId);
            return ResponseEntity.ok("Youth profile deleted successfully");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed: " + e.getMessage());
        }
    }
}