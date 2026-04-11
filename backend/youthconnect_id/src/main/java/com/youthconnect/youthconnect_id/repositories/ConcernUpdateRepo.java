package com.youthconnect.youthconnect_id.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.youthconnect.youthconnect_id.models.ConcernUpdate;

@Repository
public interface ConcernUpdateRepo extends JpaRepository<ConcernUpdate, Integer> {
    
    @Query(value = "SELECT cu.* FROM tbl_concern_update cu " +
           "INNER JOIN tbl_concern c ON cu.concern_id = c.concern_id " +
           "WHERE c.youth_id = :youthId " +
           "ORDER BY cu.created_at DESC", 
           nativeQuery = true)
    List<ConcernUpdate> findByYouthId(@Param("youthId") int youthId);
    
    List<ConcernUpdate> findByConcernIdOrderByCreatedAtDesc(int concernId);
}