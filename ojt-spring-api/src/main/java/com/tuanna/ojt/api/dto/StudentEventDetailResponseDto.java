package com.tuanna.ojt.api.dto;

import java.util.ArrayList;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
@AllArgsConstructor
public class StudentEventDetailResponseDto {

  private String code;
  
  private String name;
  
  @Builder.Default
  private List<EventDetailDto> events = new ArrayList<>();
  
  @Builder.Default
  private List<HashtagDto> hashtags = new ArrayList<>();
}
