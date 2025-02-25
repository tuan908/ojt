package com.tuanna.api.service;

import java.util.concurrent.CompletableFuture;

import com.tuanna.api.dto.LoginDto;
import com.tuanna.api.dto.LoginResponseDto;
import com.tuanna.api.dto.UserDto;

public interface UserService {

  UserDto findByUsername(UserDto request);
  
  /**
   * Login
   * @param loginDto Login Request DTO
   * @return UserDto - User Info
   */
  LoginResponseDto login(LoginDto loginDto);

  CompletableFuture<?> findByUsernameAsync(String user);
  
  CompletableFuture<?> findAllAsync();

}
