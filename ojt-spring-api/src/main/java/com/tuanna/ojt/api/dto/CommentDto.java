package com.tuanna.ojt.api.dto;

import java.time.LocalDateTime;

public record CommentDto(Long id, String fullname, LocalDateTime createdAt, Boolean isDeleted) {

}
