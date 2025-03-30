package com.tuanna.api.service;

import com.tuanna.api.dto.ApiResponse;
import com.tuanna.api.dto.CreateDto;
import com.tuanna.api.dto.StudentEventDto;
import com.tuanna.api.dto.RegisterEventDto;
import com.tuanna.api.dto.UpdateEventStatusDto;
import com.tuanna.api.dto.UpdateStudentEventDto;

public interface StudentEventService {

  ApiResponse<StudentEventDto> findById(Long id);

  ApiResponse<CreateDto> create(RegisterEventDto dto);

  ApiResponse<Object> update(UpdateStudentEventDto dto);

  ApiResponse<Object> delete(Long id);

  ApiResponse<Boolean> changeStatus(UpdateEventStatusDto dto);

}
