package com.tuanna.ojt.api.account;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import lombok.RequiredArgsConstructor;


@RestController
@RequestMapping(path = "/api/v1/account/**")
@RequiredArgsConstructor
public class AccountController {

    private final AccountService accountService;

    @PostMapping()
    public ResponseEntity<AccountDto> getOneBy(AccountDto request) {
        var body = this.accountService.getOneBy(request);
        return new ResponseEntity<AccountDto>(body, HttpStatus.OK);
    }
}
