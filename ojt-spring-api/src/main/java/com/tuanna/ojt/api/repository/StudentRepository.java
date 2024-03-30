package com.tuanna.ojt.api.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.tuanna.ojt.api.entity.Student;

public interface StudentRepository extends JpaRepository<Student, Long> {
	@Query("""
  		select
 			 s
 		from
 			com.tuanna.ojt.api.entity.Student s
 		where
 			s.user.username = :username
	""")
	Optional<Student> findByUsername(@Param("username") String username);
}
