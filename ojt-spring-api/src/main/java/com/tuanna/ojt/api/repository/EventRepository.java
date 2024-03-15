package com.tuanna.ojt.api.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.tuanna.ojt.api.entity.Event;

public interface EventRepository extends JpaRepository<Event, Long> {

}
