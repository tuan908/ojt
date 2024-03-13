package com.tuanna.ojt.api.event;

import java.time.LocalDateTime;

public record EventDto(Long id, String name, LocalDateTime createdTime, LocalDateTime updatedTime) {

}
