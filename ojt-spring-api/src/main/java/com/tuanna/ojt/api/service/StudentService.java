package com.tuanna.ojt.api.service;

import java.util.List;
import org.springframework.lang.NonNull;

import com.tuanna.ojt.api.dto.EventDetailDto;
import com.tuanna.ojt.api.dto.RegisterEventDto;
import com.tuanna.ojt.api.dto.RegisterEventResponseDto;
import com.tuanna.ojt.api.dto.StudentEventRequestDto;
import com.tuanna.ojt.api.dto.StudentEventResponseDto;
import com.tuanna.ojt.api.dto.UpdateEventStatusDto;

public interface StudentService {

  List<StudentEventResponseDto> getEventList(StudentEventRequestDto dto);

  StudentEventResponseDto getEventsByStudentCode(String code);

  Boolean updateEventStatus(UpdateEventStatusDto dto);

  RegisterEventResponseDto registerOrUpdateEvent(RegisterEventDto dto);

  /**
   * Delete event and return updated list
   * @param code Student code
   * @param id Event id
   * @return {@code List<EventDetailDto>}
   */
  List<EventDetailDto> deleteEventById(String code, @NonNull Long id);

  EventDetailDto getStudentEventById(@NonNull Long id);

  List<EventDetailDto> getEventsByStudentCode(String code, String grade, String eventName,
      String status);

}
