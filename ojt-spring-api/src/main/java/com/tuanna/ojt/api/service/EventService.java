package com.tuanna.ojt.api.service;

import java.util.List;
import java.util.Optional;
import com.tuanna.ojt.api.dto.EventDto;
import com.tuanna.ojt.api.dto.StudentEventRequestDto;

public interface EventService {
  
  List<EventDto> getAll(StudentEventRequestDto eventRequestDto);
  
  Optional<EventDto> getOneBy(EventDto request);
}
