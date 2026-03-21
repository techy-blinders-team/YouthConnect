package com.youthconnect.youthconnect_id.repositories;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.youthconnect.youthconnect_id.models.SkOfficialsUser;

@Repository
public interface SkOfficialRepo extends JpaRepository<SkOfficialsUser, Integer> {
    Optional<SkOfficialsUser> findByEmail(String email);
}