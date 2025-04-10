package com.tuanna.api.dto;

import java.util.List;

public final record StudentsDto(
    Long id,
    String code,
    String name,
    String grade,
    String events,
    List<HashtagDto> hashtags) {
}
