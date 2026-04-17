package com.youthconnect.youthconnect_id.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.youthconnect.youthconnect_id.models.YouthProfile;

@Repository
public interface YouthProfileRepo extends JpaRepository<YouthProfile, Integer> {
	@Query("""
			SELECT yp
			FROM YouthProfile yp
			WHERE EXISTS (
				SELECT 1
				FROM User u
				WHERE u.youthId = yp.youthId
				AND u.isActive = true
			)
			""")
	List<YouthProfile> findAllActiveProfiles();

	@Query("""
			SELECT yp
			FROM YouthProfile yp
			WHERE yp.youthId = :youthId
			AND EXISTS (
				SELECT 1
				FROM User u
				WHERE u.youthId = yp.youthId
				AND u.isActive = true
			)
			""")
	Optional<YouthProfile> findActiveByYouthId(int youthId);
}
