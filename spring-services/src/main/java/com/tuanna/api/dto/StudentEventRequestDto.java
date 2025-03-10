package com.tuanna.api.dto;

import java.util.List;

public record StudentEventRequestDto(
    String name,
    String grade,
    String event,
    List<String> hashtags,
    int pageNumber,
    int pageSize) {

}
