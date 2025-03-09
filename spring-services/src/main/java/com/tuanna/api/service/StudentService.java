package com.tuanna.api.service;

import java.util.List;

import org.springframework.data.web.PagedModel;
import org.springframework.lang.NonNull;

import com.tuanna.api.dto.ApiResponse;
import com.tuanna.api.dto.EventDetailDto;
import com.tuanna.api.dto.RegisterEventDto;
import com.tuanna.api.dto.RegisterEventResponseDto;
import com.tuanna.api.dto.StudentEventDto;
import com.tuanna.api.dto.StudentEventRequestDto;
import com.tuanna.api.dto.StudentEventsDto;
import com.tuanna.api.dto.UpdateEventStatusDto;

public interface StudentService {

  ApiResponse<List<StudentEventDto>> findAll(StudentEventRequestDto dto);

  Boolean updateEventStatus(UpdateEventStatusDto dto);

  RegisterEventResponseDto register(RegisterEventDto dto);
  
  RegisterEventResponseDto update(RegisterEventDto dto);

  /**
   * Delete event and return updated list
   * @param code Student code
   * @param id Event id
   * @return {@code List<EventDetailDto>}
   */
  List<EventDetailDto> delete(String code, @NonNull Long id);

  EventDetailDto findById(@NonNull Long id);

  PagedModel<EventDetailDto> findEventsByStudentCode(StudentEventsDto request);
  
}