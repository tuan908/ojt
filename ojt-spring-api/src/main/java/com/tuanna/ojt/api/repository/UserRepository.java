package com.tuanna.ojt.api.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;

import com.tuanna.ojt.api.entity.User;

public interface UserRepository extends JpaRepository<User, Long> {

  Optional<User> findByUsername(@Param("username") String username);

}
