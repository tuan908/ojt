package com.tuanna.ojt.api.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.lang.NonNull;

import com.tuanna.ojt.api.entity.EventDetail;

public interface EventDetailRepository extends JpaRepository<EventDetail, Long> {
    @Override
    @NonNull
    Optional<EventDetail> findById(@NonNull Long id);
}
