package com.tuanna.ojt.api.dto;

import java.time.LocalDateTime;

public record EventDto(Long id, String name, LocalDateTime createdTime, LocalDateTime updatedTime) {

}
