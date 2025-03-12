package com.tuanna.api.controller;

import java.net.URI;
import java.util.concurrent.ExecutionException;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.tuanna.api.constant.Constant;
import com.tuanna.api.dto.ApiResponse;
import com.tuanna.api.dto.CreateAccountDto;
import com.tuanna.api.dto.UserDto;
import com.tuanna.api.service.UserService;

@RestController
@RequestMapping(path = Constant.API_BASE_PATH + "/users")
public class UserController {

  private final UserService userService;

  public UserController(UserService accountService) {
    this.userService = accountService;
  }

  @PostMapping()
  public ResponseEntity<ApiResponse<UserDto>> getOneBy(@RequestBody UserDto request) {
    var body = this.userService.findByUsername(request);
    return ResponseEntity.ok(ApiResponse.success(body, null));
  }

  @GetMapping("/{username}/async")
  public ResponseEntity<?> getOneByAsync(@PathVariable String username)
      throws InterruptedException, ExecutionException {
    var body = this.userService.findByUsernameAsync(username);
    var data = body.get();
    return ResponseEntity.ok(ApiResponse.success(data, null));
  }

  @GetMapping("/async")
  public ResponseEntity<?> getStudentAsync() throws InterruptedException, ExecutionException {
    var result = this.userService.findAllAsync();
    return ResponseEntity.ok(result.get());
  }

  @PostMapping("/create")
  public ResponseEntity<?> createUser(@RequestBody CreateAccountDto dto) {
    this.userService.createUser(dto);
    return ResponseEntity.created(URI.create(null)).build();
  }
}
