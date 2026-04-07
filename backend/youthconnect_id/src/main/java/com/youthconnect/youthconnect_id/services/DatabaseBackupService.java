package com.youthconnect.youthconnect_id.services;

public interface DatabaseBackupService {
    byte[] generateBackup() throws Exception;
    String generateFilename();
    void restoreBackup(byte[] sqlBackupData) throws Exception;
}