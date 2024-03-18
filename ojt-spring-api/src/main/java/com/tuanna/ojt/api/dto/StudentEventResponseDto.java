package com.tuanna.ojt.api.dto;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
@AllArgsConstructor
public class StudentEventResponseDto {

  private String code;
  
  private String name;
  
  @Builder.Default
  private List<EventDto> events = new ArrayList<>();
  
  @Builder.Default
  private Set<HashtagDto> hashtags = new HashSet<>();
}
