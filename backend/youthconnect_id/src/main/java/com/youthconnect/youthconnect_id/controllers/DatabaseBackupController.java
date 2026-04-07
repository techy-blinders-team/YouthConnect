package com.youthconnect.youthconnect_id.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;

import com.youthconnect.youthconnect_id.services.DatabaseBackupService;

@RestController
@RequestMapping("/api/administrator/backup")
public class DatabaseBackupController {

    @Autowired
    private DatabaseBackupService databaseBackupService;

    @GetMapping
    public ResponseEntity<?> backupDatabase() {
        try {
            byte[] backupData = databaseBackupService.generateBackup();
            String filename = databaseBackupService.generateFilename();

            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + filename + "\"")
                    .contentType(MediaType.APPLICATION_OCTET_STREAM)
                    .body(backupData);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Backup failed: " + e.getMessage());
        }
    }

    @PostMapping(value = "/restore", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> restoreDatabase(@RequestParam("file") MultipartFile backupFile) {
        if (backupFile == null || backupFile.isEmpty()) {
            return ResponseEntity.badRequest().body("Please select a backup file to restore.");
        }

        try {
            databaseBackupService.restoreBackup(backupFile.getBytes());
            return ResponseEntity.ok("Database restored successfully.");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Restore failed: " + e.getMessage());
        }
    }
}