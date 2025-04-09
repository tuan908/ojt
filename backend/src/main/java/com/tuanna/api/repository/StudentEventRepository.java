package com.tuanna.api.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.lang.NonNull;

import com.tuanna.api.entity.StudentEvent;

public interface StudentEventRepository extends JpaRepository<StudentEvent, Long> {
  @Override
  @NonNull
  @Query(value = """
          select
              ed
          from
              com.tuanna.api.entity.StudentEvent ed
          where
              ed.id = :id
      """)
  Optional<StudentEvent> findById(final @NonNull @Param(value = "id") Long id);
}
