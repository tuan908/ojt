package com.tuanna.ojt.api.dto;

import java.util.List;

public record EventDetailDto(Long id, String name, Integer status, List<CommentDto> comments) {

}
