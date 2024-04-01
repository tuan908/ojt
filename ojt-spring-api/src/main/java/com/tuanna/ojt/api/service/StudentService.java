package com.tuanna.ojt.api.service;

import java.util.List;
import org.springframework.data.domain.Page;
import com.tuanna.ojt.api.dto.EventDetailDto;
import com.tuanna.ojt.api.dto.RegisterEventDto;
import com.tuanna.ojt.api.dto.RegisterEventResponseDto;
import com.tuanna.ojt.api.dto.StudentEventRequestDto;
import com.tuanna.ojt.api.dto.StudentEventResponseDto;
import com.tuanna.ojt.api.dto.UpdateEventStatusDto;

public interface StudentService {

  Page<StudentEventResponseDto> getEventList(StudentEventRequestDto dto);

  StudentEventResponseDto getStudentEventListByStudentCode(String code);

  Boolean updateEventStatus(UpdateEventStatusDto dto);

  RegisterEventResponseDto registerOrUpdateEvent(RegisterEventDto dto);

  void deleteEventById(Long id);

  EventDetailDto getStudentEventById(Long id);

  List<EventDetailDto> getEventListByStudentCode(String code, String grade, String eventName,
      String status);

}
