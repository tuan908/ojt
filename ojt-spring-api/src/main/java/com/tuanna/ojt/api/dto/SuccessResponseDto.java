package com.tuanna.ojt.api.dto;

/**
 * SuccessResponseDto
 * @param code OJT Code
 * @param title DTO title
 * @param message Message
 * @param path Updated path
 */
public record SuccessResponseDto(String code, String title, String message, String path) {

}
