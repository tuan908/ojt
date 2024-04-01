package com.tuanna.ojt.api.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.tuanna.ojt.api.dto.UserDto;
import com.tuanna.ojt.api.exception.ResultNotFoundException;
import com.tuanna.ojt.api.service.UserService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping(path = "/api/v1/user")
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
}
