package com.youthconnect.youthconnect_id.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.youthconnect.youthconnect_id.models.SkOfficialsUser;

@Repository
public interface SkOfficialRepo extends JpaRepository<SkOfficialsUser, Integer> {
    Optional<SkOfficialsUser> findByEmail(String email);
    Optional<SkOfficialsUser> findByResetToken(String resetToken);
    
    @Query("SELECT s.email FROM SkOfficialsUser s WHERE s.isActive = true")
    List<String> findAllActiveEmails();
}