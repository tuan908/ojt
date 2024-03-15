package com.tuanna.ojt.api.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.tuanna.ojt.api.dto.AccountDto;
import com.tuanna.ojt.api.exception.ResultNotFoundException;
import com.tuanna.ojt.api.service.AccountService;
import lombok.RequiredArgsConstructor;


@RestController
@RequestMapping(path = "/api/v1/account")
@RequiredArgsConstructor
public class AccountController {

    private final AccountService accountService;

    @PostMapping()
    public ResponseEntity<AccountDto> getOneBy(@RequestBody AccountDto request)
            throws ResultNotFoundException {
        var body = this.accountService.getOneBy(request);
        if (body == null) {
            throw new ResultNotFoundException("""
                    Sorry, We couldn't find what you're looking for. Please try again later.
                        """);
        } else {
            return new ResponseEntity<AccountDto>(body, HttpStatus.OK);
        }
    }
}
