package com.youthconnect.youthconnect_id.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.youthconnect.youthconnect_id.models.ConcernUpdate;

@Repository
public interface ConcernUpdateRepo extends JpaRepository<ConcernUpdate, Integer> {
}