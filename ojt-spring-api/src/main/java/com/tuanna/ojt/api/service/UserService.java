package com.tuanna.ojt.api.service;

import com.tuanna.ojt.api.dto.LoginDto;
import com.tuanna.ojt.api.dto.UserDto;

public interface UserService {

  UserDto getOneBy(UserDto request);
  
  /**
   * Login
   * @param loginDto Login Request DTO
   * @return UserDto - User Info
   */
  UserDto login(LoginDto loginDto);

}
