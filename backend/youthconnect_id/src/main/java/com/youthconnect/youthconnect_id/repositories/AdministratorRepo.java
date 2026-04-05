package com.youthconnect.youthconnect_id.repositories;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.youthconnect.youthconnect_id.models.Administrator;

@Repository
public interface AdministratorRepo extends JpaRepository<Administrator, Integer> {
    Optional<Administrator> findByEmail(String email);
    boolean existsByEmail(String email);
    boolean existsByUsername(String username);
}