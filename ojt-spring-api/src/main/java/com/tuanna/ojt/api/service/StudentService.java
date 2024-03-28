package com.tuanna.ojt.api.service;

import java.util.List;
import org.springframework.data.domain.Page;
import com.tuanna.ojt.api.dto.AddCommentDto;
import com.tuanna.ojt.api.dto.CommentDto;
import com.tuanna.ojt.api.dto.DeleteCommentDto;
import com.tuanna.ojt.api.dto.EventDetailDto;
import com.tuanna.ojt.api.dto.RegisterEventDto;
import com.tuanna.ojt.api.dto.RegisterEventResponseDto;
import com.tuanna.ojt.api.dto.StudentEventRequestDto;
import com.tuanna.ojt.api.dto.StudentEventResponseDto;
import com.tuanna.ojt.api.dto.UpdateEventStatusDto;

public interface StudentService {

  Page<StudentEventResponseDto> getStudentEventList(StudentEventRequestDto dto);

  StudentEventResponseDto getStudentEventListByStudentCode(String code);
  
  Boolean updateEventStatus(UpdateEventStatusDto dto);

  RegisterEventResponseDto registerEvent(RegisterEventDto dto);

  EventDetailDto getStudentEventById(Long id);
  
  List<CommentDto> addCommentForEventDetailById(AddCommentDto dto);
  
  void deleteCommentById(DeleteCommentDto dto);
}
