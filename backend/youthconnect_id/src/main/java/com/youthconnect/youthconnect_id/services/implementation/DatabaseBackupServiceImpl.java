package com.youthconnect.youthconnect_id.services.implementation;
import java.nio.charset.StandardCharsets;
import java.sql.Connection;
import java.sql.DatabaseMetaData;
import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.sql.Statement;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import javax.sql.DataSource;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.support.EncodedResource;
import org.springframework.jdbc.datasource.init.ScriptUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.youthconnect.youthconnect_id.models.BackupOperationLog;
import com.youthconnect.youthconnect_id.repositories.BackupOperationLogRepo;
import com.youthconnect.youthconnect_id.services.DatabaseBackupService;

@Service
public class DatabaseBackupServiceImpl implements DatabaseBackupService {

    @Value("${spring.datasource.url}")
    private String datasourceUrl;

    @Value("${spring.datasource.username}")
    private String dbUsername;

    @Value("${spring.datasource.password}")
    private String dbPassword;

    @Autowired
    private DataSource dataSource;

    @Autowired
    private BackupOperationLogRepo backupOperationLogRepo;

    @Override
    public byte[] generateBackup() throws Exception {
        String dbName = datasourceUrl.substring(datasourceUrl.lastIndexOf("/") + 1).split("\\?")[0];
        StringBuilder dump = new StringBuilder(1024 * 128);

        dump.append("-- YouthConnect SQL Backup\n");
        dump.append("-- Generated at: ").append(LocalDateTime.now()).append("\n");
        dump.append("-- Database: `").append(dbName).append("`\n\n");
        dump.append("SET SQL_MODE = \"NO_AUTO_VALUE_ON_ZERO\";\n");
        dump.append("SET time_zone = \"+00:00\";\n\n");
        dump.append("START TRANSACTION;\n");
        dump.append("SET FOREIGN_KEY_CHECKS=0;\n\n");

        try (Connection connection = dataSource.getConnection(); Statement statement = connection.createStatement()) {
            List<String> tableNames = getTableNames(connection, dbName);

            for (String tableName : tableNames) {
                dump.append("-- --------------------------------------------------------\n");
                dump.append("-- Table structure for table `").append(tableName).append("`\n");
                dump.append("-- --------------------------------------------------------\n\n");

                String createTableSql = getCreateTableSql(statement, tableName);
                dump.append("DROP TABLE IF EXISTS `").append(tableName).append("`;\n");
                dump.append(createTableSql).append(";\n\n");

                appendTableDataDump(statement, tableName, dump);
                dump.append("\n");
            }
        }

        dump.append("SET FOREIGN_KEY_CHECKS=1;\n");
        dump.append("COMMIT;\n");

        return dump.toString().getBytes(StandardCharsets.UTF_8);
    }

    @Override
    public void restoreBackup(byte[] sqlBackupData) throws Exception {
        if (sqlBackupData == null || sqlBackupData.length == 0) {
            throw new IllegalArgumentException("Backup file is empty.");
        }

        String dbName = datasourceUrl.substring(datasourceUrl.lastIndexOf("/") + 1).split("\\?")[0];

        try (Connection connection = dataSource.getConnection()) {
            clearExistingTables(connection, dbName);
            EncodedResource sqlResource = new EncodedResource(new ByteArrayResource(sqlBackupData), StandardCharsets.UTF_8);
            ScriptUtils.executeSqlScript(connection, sqlResource);
        } catch (Exception ex) {
            throw new RuntimeException("Database restore failed: " + ex.getMessage(), ex);
        }
    }

    @Override
    public String generateFilename() {
        String timestamp = LocalDateTime.now()
                .format(DateTimeFormatter.ofPattern("yyyy-MM-dd_HH-mm-ss"));
        return "youthconnectdb_backup_" + timestamp + ".sql";
    }

    @Override
    public void recordBackupCreated() {
        BackupOperationLog operationLog = new BackupOperationLog();
        operationLog.setAction("CREATE");
        operationLog.setExecutedAt(LocalDateTime.now());
        backupOperationLogRepo.save(operationLog);
    }

    @Override
    public LocalDateTime getLastBackupCreatedAt() {
        Optional<BackupOperationLog> latestBackupOperation =
                backupOperationLogRepo.findTopByActionOrderByExecutedAtDesc("CREATE");

        return latestBackupOperation.map(BackupOperationLog::getExecutedAt).orElse(null);
    }

    @Override
    public boolean isDatabaseConnected() {
        try (Connection connection = dataSource.getConnection()) {
            return connection.isValid(2);
        } catch (Exception ex) {
            return false;
        }
    }

    private List<String> getTableNames(Connection connection, String dbName) throws Exception {
        List<String> tableNames = new ArrayList<>();
        DatabaseMetaData metaData = connection.getMetaData();

        try (ResultSet resultSet = metaData.getTables(dbName, null, "%", new String[] { "TABLE" })) {
            while (resultSet.next()) {
                String tableName = resultSet.getString("TABLE_NAME");
                if (tableName != null && !tableName.isBlank()) {
                    tableNames.add(tableName);
                }
            }
        }

        tableNames.sort(String::compareTo);
        return tableNames;
    }

    private String getCreateTableSql(Statement statement, String tableName) throws Exception {
        try (ResultSet resultSet = statement.executeQuery("SHOW CREATE TABLE `" + tableName + "`")) {
            if (!resultSet.next()) {
                throw new RuntimeException("Unable to get table definition for " + tableName);
            }
            return resultSet.getString(2);
        }
    }

    private void appendTableDataDump(Statement statement, String tableName, StringBuilder dump) throws Exception {
        try (ResultSet resultSet = statement.executeQuery("SELECT * FROM `" + tableName + "`")) {
            ResultSetMetaData metadata = resultSet.getMetaData();
            int columnCount = metadata.getColumnCount();
            boolean hasRows = false;

            while (resultSet.next()) {
                if (!hasRows) {
                    dump.append("-- Dumping data for table `").append(tableName).append("`\n");
                    dump.append("INSERT INTO `").append(tableName).append("` VALUES\n");
                    hasRows = true;
                } else {
                    dump.append(",\n");
                }

                dump.append("(");
                for (int columnIndex = 1; columnIndex <= columnCount; columnIndex++) {
                    if (columnIndex > 1) {
                        dump.append(", ");
                    }
                    Object value = resultSet.getObject(columnIndex);
                    dump.append(toSqlLiteral(value));
                }
                dump.append(")");
            }

            if (hasRows) {
                dump.append(";\n");
            }
        }
    }

    private String toSqlLiteral(Object value) {
        if (value == null) {
            return "NULL";
        }

        if (value instanceof Number) {
            return value.toString();
        }

        if (value instanceof Boolean) {
            return ((Boolean) value) ? "1" : "0";
        }

        String text = value.toString()
                .replace("\\", "\\\\")
                .replace("'", "''")
                .replace("\r", "\\r")
                .replace("\n", "\\n");
        return "'" + text + "'";
    }

    private void clearExistingTables(Connection connection, String dbName) throws Exception {
        List<String> existingTables = getTableNames(connection, dbName);

        try (Statement statement = connection.createStatement()) {
            statement.execute("SET FOREIGN_KEY_CHECKS=0");
            for (String tableName : existingTables) {
                statement.execute("DROP TABLE IF EXISTS `" + tableName + "`");
            }
            statement.execute("SET FOREIGN_KEY_CHECKS=1");
        }
    }
}