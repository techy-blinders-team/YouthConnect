package com.youthconnect.youthconnect_id.dto;

import java.time.LocalDateTime;

public class SystemControlStatusResponse {
    private boolean databaseConnected;
    private boolean apiServerRunning;
    private LocalDateTime lastBackupAt;

    public boolean isDatabaseConnected() {
        return databaseConnected;
    }

    public void setDatabaseConnected(boolean databaseConnected) {
        this.databaseConnected = databaseConnected;
    }

    public boolean isApiServerRunning() {
        return apiServerRunning;
    }

    public void setApiServerRunning(boolean apiServerRunning) {
        this.apiServerRunning = apiServerRunning;
    }

    public LocalDateTime getLastBackupAt() {
        return lastBackupAt;
    }

    public void setLastBackupAt(LocalDateTime lastBackupAt) {
        this.lastBackupAt = lastBackupAt;
    }
}
