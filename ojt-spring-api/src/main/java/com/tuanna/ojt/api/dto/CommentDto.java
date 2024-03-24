package com.tuanna.ojt.api.dto;

import java.time.LocalDateTime;

public record CommentDto(Long id, String fullname, String content, String createdAt,
    Boolean isDeleted) {

}
