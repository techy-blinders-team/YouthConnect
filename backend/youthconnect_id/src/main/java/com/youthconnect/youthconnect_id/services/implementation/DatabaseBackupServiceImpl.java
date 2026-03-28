package com.youthconnect.youthconnect_id.services.implementation;

import java.io.BufferedReader;
import java.io.ByteArrayOutputStream;
import java.io.InputStreamReader;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.youthconnect.youthconnect_id.services.DatabaseBackupService;

@Service
public class DatabaseBackupServiceImpl implements DatabaseBackupService {

    @Value("${spring.datasource.url}")
    private String datasourceUrl;

    @Value("${spring.datasource.username}")
    private String dbUsername;

    @Value("${spring.datasource.password}")
    private String dbPassword;

    @Override
    public byte[] generateBackup() throws Exception {
        // Extract DB name from URL
        // e.g. jdbc:mysql://localhost:3306/youthconnectdb
        String dbName = datasourceUrl.substring(datasourceUrl.lastIndexOf("/") + 1)
                .split("\\?")[0];

        String[] command = {
            "mysqldump",
            "-u", dbUsername,
            "-p" + dbPassword,
            "--databases", dbName,
            "--routines",
            "--triggers",
            "--single-transaction"
        };

        ProcessBuilder processBuilder = new ProcessBuilder(command);
        processBuilder.redirectErrorStream(false);
        Process process = processBuilder.start();

        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        byte[] buffer = new byte[1024];
        int length;

        try (var inputStream = process.getInputStream()) {
            while ((length = inputStream.read(buffer)) != -1) {
                outputStream.write(buffer, 0, length);
            }
        }

        // Check for errors
        StringBuilder errorOutput = new StringBuilder();
        try (BufferedReader errorReader = new BufferedReader(
                new InputStreamReader(process.getErrorStream()))) {
            String line;
            while ((line = errorReader.readLine()) != null) {
                errorOutput.append(line).append("\n");
            }
        }

        int exitCode = process.waitFor();
        if (exitCode != 0) {
            throw new RuntimeException("mysqldump failed: " + errorOutput);
        }

        return outputStream.toByteArray();
    }

    @Override
    public String generateFilename() {
        String timestamp = LocalDateTime.now()
                .format(DateTimeFormatter.ofPattern("yyyy-MM-dd_HH-mm-ss"));
        return "youthconnectdb_backup_" + timestamp + ".sql";
    }
}