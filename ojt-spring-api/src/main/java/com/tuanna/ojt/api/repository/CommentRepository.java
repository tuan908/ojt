package com.tuanna.ojt.api.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.tuanna.ojt.api.entity.Comment;

public interface CommentRepository extends JpaRepository<Comment, Long> {

}
