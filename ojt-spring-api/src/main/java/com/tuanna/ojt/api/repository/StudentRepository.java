package com.tuanna.ojt.api.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.tuanna.ojt.api.entity.Student;

public interface StudentRepository extends JpaRepository<Student, Long> {
	@Query(value = """
        select 
          s 
        from 
          com.tuanna.ojt.api.entity.Student s 
        where 
          s.user.username = :username
	""")
	Optional<Student> findByUsername(@Param(value = "username") String username);
	
	@Query(value = """
        select 
          s 
        from 
          com.tuanna.ojt.api.entity.Student s 
        left join fetch
	      s.events
        where 
          1 = 1 
          and s.code = :code 
	""")
	Optional<Student> findByCode(@Param(value = "code") String code);
}
