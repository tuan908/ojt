package com.tuanna.api.controller;

import java.net.URI;
import java.util.ResourceBundle;
import java.util.concurrent.ExecutionException;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.tuanna.api.constant.Constant;
import com.tuanna.api.constant.ResponseCode;
import com.tuanna.api.dto.ApiResponse;
import com.tuanna.api.dto.CreateAccountDto;
import com.tuanna.api.dto.UserDto;
import com.tuanna.api.exception.ResultNotFoundException;
import com.tuanna.api.service.UserService;

@RestController
@RequestMapping(path = Constant.API_BASE_PATH + "/users")
public class UserController {

	private final UserService userService;

	private final ResourceBundle messageBundle;

	public UserController(UserService accountService) {
		this.userService = accountService;
		messageBundle = ResourceBundle.getBundle("messages");
	}

	@PostMapping()
	public ResponseEntity<ApiResponse<UserDto>> getOneBy(@RequestBody UserDto request) throws ResultNotFoundException {
		var body = this.userService.findByUsername(request);
		if (body == null) {
			throw new ResultNotFoundException(messageBundle.getString("message.user.not-found"));
		} 
		return ResponseEntity.ok(ApiResponse.success(body, null));
	}

	@GetMapping("/{username}/async")
	public ResponseEntity<?> getOneByAsync(@PathVariable String username) {
		var body = this.userService.findByUsernameAsync(username);
		try {
			var data = body.get();
			return ResponseEntity.ok(ApiResponse.success(data, null));
		} catch (InterruptedException | ExecutionException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return ResponseEntity.ok(ApiResponse.error(ResponseCode.INTERNAL_SERVER_ERROR.getValue(), null,
				ResponseCode.INTERNAL_SERVER_ERROR.getValue()));
	}

	@GetMapping("/async")
	public ResponseEntity<?> getStudentAsync() {
		var result = this.userService.findAllAsync();
		try {
			return ResponseEntity.ok(result.get());
		} catch (InterruptedException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (ExecutionException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return null;
	}
	
	@PostMapping("/create")
	public ResponseEntity<?> createUser(@RequestBody CreateAccountDto dto) {
		try {
			this.userService.createUser(dto);
			return ResponseEntity.created(URI.create(null)).build();
		} catch (Exception e) {
		}
		return ResponseEntity.internalServerError().build();
	}
}
