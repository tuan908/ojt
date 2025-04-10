package com.tuanna.api.service;

import com.tuanna.api.dto.ApiResponse;
import com.tuanna.api.dto.CreateDto;
import com.tuanna.api.dto.StudentEventDto;
import com.tuanna.api.dto.CreateStudentEventDto;
import com.tuanna.api.dto.UpdateEventStatusDto;
import com.tuanna.api.dto.UpdateStudentEventDto;
import com.tuanna.api.dto.response.UpdateEventStatusResponseDto;

public interface StudentEventService {

  ApiResponse<StudentEventDto> findById(Long id);

  ApiResponse<CreateDto> create(CreateStudentEventDto dto);

  ApiResponse<Object> update(UpdateStudentEventDto dto);

  ApiResponse<Object> delete(Long id);

  ApiResponse<UpdateEventStatusResponseDto> changeStatus(UpdateEventStatusDto dto);

}
