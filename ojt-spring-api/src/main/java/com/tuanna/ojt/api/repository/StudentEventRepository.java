package com.tuanna.ojt.api.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.tuanna.ojt.api.entity.StudentEvent;

public interface StudentEventRepository extends JpaRepository<StudentEvent, Long> {

}
