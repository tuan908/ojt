package com.tuanna.api.dto;

public record StudentEventsDto(
    String studentCode,
    String grade,
    String eventName,
    String status,
    int page,
    int size) {

}
