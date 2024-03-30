package com.tuanna.ojt.api.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.tuanna.ojt.api.entity.Event;

public interface EventRepository extends JpaRepository<Event, Long> {

	@Query("""
			select
				e
			from
				com.tuanna.ojt.api.entity.Event e
			where
				e.name = :name
			  """)
	Optional<Event> findByName(@Param("name") String name);
}
