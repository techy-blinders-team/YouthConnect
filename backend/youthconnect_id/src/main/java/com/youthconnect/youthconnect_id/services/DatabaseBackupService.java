package com.youthconnect.youthconnect_id.services;

import java.time.LocalDateTime;

public interface DatabaseBackupService {
    byte[] generateBackup() throws Exception;
    String generateFilename();
    void restoreBackup(byte[] sqlBackupData) throws Exception;
    void recordBackupCreated();
    LocalDateTime getLastBackupCreatedAt();
    boolean isDatabaseConnected();
}