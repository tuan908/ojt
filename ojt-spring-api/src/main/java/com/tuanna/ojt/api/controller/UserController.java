package com.tuanna.ojt.api.controller;

import java.util.HashMap;
import java.util.concurrent.ExecutionException;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.tuanna.ojt.api.constant.Constant;
import com.tuanna.ojt.api.dto.UserDto;
import com.tuanna.ojt.api.exception.ResultNotFoundException;
import com.tuanna.ojt.api.service.UserService;

import lombok.RequiredArgsConstructor;


@RestController
@RequestMapping(path = Constant.API_BASE_PATH + "/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService accountService;
    
    @PostMapping()
    public ResponseEntity<UserDto> getOneBy(@RequestBody UserDto request)
            throws ResultNotFoundException {
        var body = this.accountService.findByUsername(request);
        if (body == null) {
            throw new ResultNotFoundException("""
                    Sorry, We couldn't find what you're looking for. Please try again later.
                        """);
        } else {
            return new ResponseEntity<UserDto>(body, HttpStatus.OK);
        }
    }

    @GetMapping("/{username}/async")
    public ResponseEntity<?> getOneByAsync(@PathVariable String username) {
        var body = this.accountService.findByUsernameAsync(username);
        try {
            var data = body.get();
            return ResponseEntity.ok(data);
        } catch (InterruptedException | ExecutionException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        }
        return ResponseEntity.ok(new HashMap<>().put("message", "Not found any user!"));
    }
    
   @GetMapping("/async")
   public ResponseEntity<?> getStudentAsync() {
	   var result = this.accountService.findAllAsync();
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
   
}
