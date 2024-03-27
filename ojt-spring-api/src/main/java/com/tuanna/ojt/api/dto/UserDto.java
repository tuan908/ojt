package com.tuanna.ojt.api.dto;

/**
 * User DTO
 * @param id User Id
 * @param name User's full name
 * @param username User's username
 * @param role User's role
 */
public record UserDto(Long id, String name, String username, String role) {
}
