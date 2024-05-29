package com.tuanna.ojt.api.dto;

import java.util.List;
import com.tuanna.ojt.api.entity.EventDetail;

/**
 * Student Event Dto
 * 
 * @param id Student event id
 * @param grade Grade name
 * @param name Event name
 * @param status Event status
 * @param data Event's details
 * @param comments Event's comments
 */
public record EventDetailDto(Long id, String grade, String name, Integer status,
    EventDetail.Data data, List<CommentDto> comments) {

}
