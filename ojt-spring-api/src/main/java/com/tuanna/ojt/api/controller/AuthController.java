package com.tuanna.ojt.api.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.tuanna.ojt.api.constant.Constant;
import com.tuanna.ojt.api.dto.LoginDto;
import com.tuanna.ojt.api.service.UserService;

@RestController
@RequestMapping(path = Constant.API_BASE_PATH + "/auth")
public class AuthController {
  
  private final UserService userService;
  
  public AuthController(final UserService userService) {
    this.userService = userService;
  }
  
  @PostMapping("/login")
  public ResponseEntity<?> login(@RequestBody LoginDto loginDto) {
     var result = this.userService.login(loginDto);
     return ResponseEntity.ok(result);
  }
  
}
