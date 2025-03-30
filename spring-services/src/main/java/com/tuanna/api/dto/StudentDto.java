package com.tuanna.api.dto;

import java.util.List;
import com.tuanna.api.entity.StudentEvent;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class StudentDto {

  private Long studentId;

  private String code;

  private String name;

  private List<EventData> events;

  @Getter
  @Setter
  @Builder
  @AllArgsConstructor
  @NoArgsConstructor
  public static class EventData {
    private Long studentEventId;
    private String grade;
    private String eventName;
    private Integer status;
    private Long commentCount;
  }
}
