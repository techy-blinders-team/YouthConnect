package com.youthconnect.youthconnect_id.repositories;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.youthconnect.youthconnect_id.models.BackupOperationLog;

@Repository
public interface BackupOperationLogRepo extends JpaRepository<BackupOperationLog, Integer> {
    Optional<BackupOperationLog> findTopByActionOrderByExecutedAtDesc(String action);
}
