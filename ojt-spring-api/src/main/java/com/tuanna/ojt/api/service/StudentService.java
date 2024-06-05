package com.tuanna.ojt.api.service;

import java.util.HashMap;
import java.util.List;
import org.springframework.data.web.PagedModel;
import org.springframework.lang.NonNull;
import com.tuanna.ojt.api.dto.EventDetailDto;
import com.tuanna.ojt.api.dto.RegisterEventDto;
import com.tuanna.ojt.api.dto.RegisterEventResponseDto;
import com.tuanna.ojt.api.dto.StudentEventRequestDto;
import com.tuanna.ojt.api.dto.UpdateEventStatusDto;

public interface StudentService {

  PagedModel<?> getEvents(StudentEventRequestDto dto);

  HashMap<String, Object> getEventsByStudentCode(String code);

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
