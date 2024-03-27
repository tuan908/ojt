package com.tuanna.ojt.api.service.impl;

import org.springframework.data.jpa.repository.JpaContext;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.tuanna.ojt.api.dto.LoginDto;
import com.tuanna.ojt.api.dto.UserDto;
import com.tuanna.ojt.api.entity.User;
import com.tuanna.ojt.api.repository.UserRepository;
import com.tuanna.ojt.api.service.UserService;
import jakarta.persistence.EntityManager;

@Service
@Transactional(readOnly = true)
public class UserServiceImpl implements UserService {

  private final UserRepository userRepository;

  private final PasswordEncoder passwordEncoder;

  private final EntityManager entityManager;

  public UserServiceImpl(JpaContext jpaContext, UserRepository userRepository,
      final PasswordEncoder pe) {
    this.entityManager = jpaContext.getEntityManagerByManagedType(User.class);
    this.userRepository = userRepository;
    this.passwordEncoder = pe;
  }

  @Override
  public UserDto getOneBy(UserDto request) {
    var queryResult = this.userRepository.findByUsername(request.username());

    return queryResult.map(User::toDto).orElse(null);

  }

  @Override
  public UserDto login(LoginDto loginDto) {
    final User queryResult = this.userRepository.findByUsername(loginDto.username()).orElse(null);

    if (queryResult != null
        && passwordEncoder.matches(loginDto.password(), queryResult.getPassword())) {
      // @formatter:off
        var userDto = new UserDto(
              queryResult.getId(), 
              queryResult.getName(), 
              queryResult.getUsername(), 
              queryResult.getRole().getValue()
            );  
        // @formatter:on

      return userDto;
    }

    return null;
  }
}

