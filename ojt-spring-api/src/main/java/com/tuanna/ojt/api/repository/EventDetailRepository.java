package com.tuanna.ojt.api.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.lang.NonNull;

import com.tuanna.ojt.api.entity.EventDetail;

public interface EventDetailRepository extends JpaRepository<EventDetail, Long> {
    @Override
    @NonNull
    @Query(value = """
        select
            ed
        from
            com.tuanna.ojt.api.entity.EventDetail ed
            left join fetch ed.comments
        where
            ed.id = :id
    """)
    Optional<EventDetail> findById(final @NonNull @Param(value = "id") Long id);
}
