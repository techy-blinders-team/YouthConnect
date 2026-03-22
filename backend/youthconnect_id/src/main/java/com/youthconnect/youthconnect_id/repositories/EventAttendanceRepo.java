package com.youthconnect.youthconnect_id.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.youthconnect.youthconnect_id.models.EventAttendance;

@Repository
public interface EventAttendanceRepo extends JpaRepository<EventAttendance, Integer> {
    Optional<EventAttendance> findByEventIdAndUserId(int eventId, int userId);
    List<EventAttendance> findByUserId(int userId);
    List<EventAttendance> findByEventId(int eventId);
}