package com.tuanna.api.dto;

public record CreateAccountDto(
    String firstName,
    String lastName,
    String username,
    String password) {

}
