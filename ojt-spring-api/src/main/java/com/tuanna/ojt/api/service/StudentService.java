package com.tuanna.ojt.api.service;

import org.springframework.data.domain.Page;

import com.tuanna.ojt.api.dto.StudentEventRequestDto;
import com.tuanna.ojt.api.dto.StudentEventResponseDto;

public interface StudentService {

  Page<StudentEventResponseDto> getAll(StudentEventRequestDto dto);

  StudentEventResponseDto getByCode(String code);
}
