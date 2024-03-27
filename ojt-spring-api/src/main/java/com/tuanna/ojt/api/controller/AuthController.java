package com.tuanna.ojt.api.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;
import com.tuanna.ojt.api.dto.LoginDto;
import com.tuanna.ojt.api.dto.UserDto;
import com.tuanna.ojt.api.service.UserService;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {
  
  @Autowired
  private UserService userService;
  
  
  @PostMapping("/login")
  @ResponseBody
  public ResponseEntity<UserDto> login(@RequestBody LoginDto loginDto) {
     var result = this.userService.login(loginDto);
     return ResponseEntity.ok(result);
  }
  
}
