package com.tuanna.api.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.tuanna.api.entity.Comment;

public interface CommentRepository extends JpaRepository<Comment, Long> {

}
