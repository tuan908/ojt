package com.tuanna.ojt.api.dto;

import com.tuanna.ojt.api.entity.Event;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class RegisterEventDto {

    private String username;

    private Long eventDetailId;

    private String gradeName;

    private Event.EventData data;

}
