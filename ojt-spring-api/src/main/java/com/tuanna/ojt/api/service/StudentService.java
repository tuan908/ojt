package com.tuanna.ojt.api.service;

import java.util.List;

import com.tuanna.ojt.api.dto.StudentEventRequestDto;
import com.tuanna.ojt.api.dto.StudentEventResponseDto;

public interface StudentService {
  List<StudentEventResponseDto> getAll(StudentEventRequestDto dto);

  StudentEventResponseDto getByCode(String code);
}
