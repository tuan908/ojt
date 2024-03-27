package com.tuanna.ojt.api.dto;

public record CommentDto(Long id, String name, String username, String roleName, String content, String createdAt,
    Boolean isDeleted) {

}
