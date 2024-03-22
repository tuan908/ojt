package com.tuanna.ojt.api.dto;

import com.tuanna.ojt.api.entity.Event;

public record RegisterEventDto(Long id, UserDto user, Event.EventData data) {

}
