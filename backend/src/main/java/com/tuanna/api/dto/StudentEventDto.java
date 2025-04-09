package com.tuanna.api.dto;

import com.tuanna.api.entity.StudentEvent;

/**
 * Student Event Data Transfer Object (DTO)
 *
 * @param id           Student event id
 * @param grade        Grade name
 * @param name         Event name
 * @param status       Event status
 * @param data         Event's details
 * @param commentCount Comment count
 */
public record StudentEventDto(Long id, String grade, String name, Integer status,
        StudentEvent.Data data) {

}
