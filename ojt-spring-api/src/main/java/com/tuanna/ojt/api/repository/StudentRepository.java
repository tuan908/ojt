package com.tuanna.ojt.api.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.tuanna.ojt.api.entity.Student;

public interface StudentRepository extends JpaRepository<Student, Long> {

}
