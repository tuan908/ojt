package com.tuanna.api.service;

import java.util.concurrent.CompletableFuture;

import com.tuanna.api.dto.CreateAccountDto;
import com.tuanna.api.dto.UserDto;

public interface UserService {

  UserDto findByUsername(UserDto request);
  
  void findAllUsers();
  
  Boolean createUser(CreateAccountDto dto);
  
  void updateUser();
  
  void deleteUser();

  CompletableFuture<?> findByUsernameAsync(String user);
  
  CompletableFuture<?> findAllAsync();
}
