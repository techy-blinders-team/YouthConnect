package com.youthconnect.youthconnect_id.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.youthconnect.youthconnect_id.models.Concern;

@Repository
public interface ConcernRepo extends JpaRepository<Concern, Integer> {
    List<Concern> findByYouthId(int youthId);
}