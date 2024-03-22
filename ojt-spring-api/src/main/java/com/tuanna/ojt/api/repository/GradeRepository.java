package com.tuanna.ojt.api.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.tuanna.ojt.api.entity.Grade;

public interface GradeRepository extends JpaRepository<Grade, Long> {

    Optional<Grade> findByName(String gradeName);

}
