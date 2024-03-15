package com.tuanna.ojt.api.account;

public record AccountDto(Long id, String code, String name, String username, String password,
        AccountRole role) {
}
