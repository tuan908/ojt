package com.tuanna.ojt.api.service.impl;

import org.springframework.data.jpa.repository.JpaContext;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.tuanna.ojt.api.dto.UserDto;
import com.tuanna.ojt.api.entity.User;
import com.tuanna.ojt.api.repository.UserRepository;
import com.tuanna.ojt.api.service.UserService;

@Service
@Transactional(readOnly = true)
public class UserServiceImpl implements UserService {

  private final UserRepository userRepository;

  public UserServiceImpl(JpaContext jpaContext, UserRepository userRepository) {
    this.userRepository = userRepository;
  }

  @Override
  public UserDto getOneBy(UserDto request) {
    var queryResult = this.userRepository.findByUsername(request.username());

    return queryResult.map(User::toDto).orElse(null);

  }

}
