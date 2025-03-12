package com.tuanna.api.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.tuanna.api.constant.Constant;
import com.tuanna.api.dto.LoginDto;
import com.tuanna.api.exception.BusinessException;
import com.tuanna.api.service.AuthService;

@RestController
@RequestMapping(path = Constant.API_BASE_PATH + "/auth")
public class AuthController {

  private final AuthService authService;

  public AuthController(final AuthService authService) {
    this.authService = authService;
  }

  @PostMapping("/signin")
  public ResponseEntity<?> login(@RequestBody LoginDto loginDto) throws BusinessException {
    var result = this.authService.login(loginDto);
    return ResponseEntity.ok(result);
  }
}
