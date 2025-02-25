package com.tuanna.api.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class RegisterEventDto {
  private String username;
  private String gradeName;
  private Data data;
  
  public static record Data(String eventName, String eventsInSchoolLife, String myAction,
      String myThought, String shownPower, String strengthGrown) {
  }
}
