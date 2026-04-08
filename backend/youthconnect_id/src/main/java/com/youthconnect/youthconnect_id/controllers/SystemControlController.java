package com.youthconnect.youthconnect_id.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.youthconnect.youthconnect_id.dto.SystemControlStatusResponse;
import com.youthconnect.youthconnect_id.services.DatabaseBackupService;

@RestController
@RequestMapping("/api/administrator/system-control")
public class SystemControlController {

    @Autowired
    private DatabaseBackupService databaseBackupService;

    @GetMapping("/status")
    public ResponseEntity<SystemControlStatusResponse> getSystemStatus() {
        SystemControlStatusResponse response = new SystemControlStatusResponse();
        response.setDatabaseConnected(databaseBackupService.isDatabaseConnected());
        response.setApiServerRunning(true);
        response.setLastBackupAt(databaseBackupService.getLastBackupCreatedAt());

        return ResponseEntity.ok(response);
    }
}
