package com.youthconnect.youthconnect_id.controllers;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
}
