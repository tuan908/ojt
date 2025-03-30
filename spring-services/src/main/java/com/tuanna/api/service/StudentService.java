package com.tuanna.api.service;

import java.util.List;

import com.tuanna.api.dto.ApiResponse;
import com.tuanna.api.dto.StudentEventDto;
import com.tuanna.api.dto.StudentDto;
import com.tuanna.api.dto.StudentsDto;
import com.tuanna.api.dto.StudentEventRequestDto;
import com.tuanna.api.dto.StudentEventsDto;

public interface StudentService {

  ApiResponse<List<StudentsDto>> findAll(StudentEventRequestDto req);

  ApiResponse<StudentDto> findByStudentCode(StudentEventsDto request);

}
