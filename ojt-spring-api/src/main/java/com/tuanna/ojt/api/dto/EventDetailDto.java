package com.tuanna.ojt.api.dto;

import java.util.List;

public record EventDetailDto(Long id, String grade, String name, Integer status, List<CommentDto> comments) {

}
