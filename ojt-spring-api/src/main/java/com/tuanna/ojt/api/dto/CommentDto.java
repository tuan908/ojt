package com.tuanna.ojt.api.dto;

public record CommentDto(Long id, String fullname, String content, String createdAt,
    Boolean isDeleted) {

}
