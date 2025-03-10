package com.tuanna.api.service.impl;

import java.util.List;
import java.util.concurrent.CompletableFuture;

import org.springframework.scheduling.annotation.Async;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.tuanna.api.constant.UserRole;
import com.tuanna.api.dto.CreateAccountDto;
import com.tuanna.api.dto.StudentEventDto;
import com.tuanna.api.dto.UserDto;
import com.tuanna.api.entity.Student;
import com.tuanna.api.entity.User;
import com.tuanna.api.repository.UserRepository;
import com.tuanna.api.service.UserService;

import jakarta.persistence.EntityManager;

@Service
@Transactional(readOnly = true)
public class UserServiceImpl implements UserService {

  private final UserRepository userRepository;

  private final PasswordEncoder passwordEncoder;

  private final EntityManager entityManager;

  public UserServiceImpl(
      UserRepository userRepository,
      PasswordEncoder passwordEncoder,
      EntityManager entityManager) {
    super();
    this.userRepository = userRepository;
    this.passwordEncoder = passwordEncoder;
    this.entityManager = entityManager;
  }

  @Override
  public UserDto findByUsername(UserDto request) {
    var queryResult = this.userRepository.findByUsername(request.username());
    return queryResult.map(User::toDto).orElse(null);
  }

  @Override
  @Async
  public CompletableFuture<?> findByUsernameAsync(String username) {
    var query = entityManager.createQuery("""
        select
        	s
        from
        	com.tuanna.api.entity.Student s
        join fetch s.user
        where
        	s.code = :username
        """, Student.class);

    query.setParameter("username", username);

    var queryResult = query.getResultStream().findFirst();
    if (queryResult.isEmpty()) {
      return CompletableFuture.completedFuture(null);
    }
    return CompletableFuture.completedFuture(queryResult.get().toDto());
  }

  @Override
  @Async
  public CompletableFuture<List<StudentEventDto>> findAllAsync() {
    return CompletableFuture.supplyAsync(() -> {
      var students = this.entityManager
          .createQuery("""
              select s from com.tuanna.api.entity.Student s
              join fetch s.user
              """, Student.class)
          .getResultList() // Convert stream to list before returning
          .stream()
          .map(Student::toDto)
          .toList();
      return students;
    });
  }

  @Transactional
  @Override
  public Boolean createUser(CreateAccountDto dto) {
    try {
      var newUser = User
          .builder()
          .name(dto.firstName() + " " + dto.lastName())
          .username(dto.username())
          .password(passwordEncoder.encode(dto.password()))
          .role(UserRole.COUNSELOR)
          .build();
      this.userRepository.save(newUser);
      return true;
    } catch (Exception e) {
      return false;
    }
  }

  @Override
  public void findAllUsers() {
    // TODO Auto-generated method stub

  }

  @Override
  public void updateUser() {
    // TODO Auto-generated method stub

  }

  @Override
  public void deleteUser() {
    // TODO Auto-generated method stub

  }
}
