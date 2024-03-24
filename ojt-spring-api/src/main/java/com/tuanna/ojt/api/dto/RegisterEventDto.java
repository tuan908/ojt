package com.tuanna.ojt.api.dto;

import org.springframework.lang.NonNull;
import org.springframework.lang.Nullable;

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

    @NonNull
    private String username;

    @NonNull
    private Long eventDetailId;

    @NonNull
    private String gradeName;

    @Nullable
    private Event.EventData data;

}
