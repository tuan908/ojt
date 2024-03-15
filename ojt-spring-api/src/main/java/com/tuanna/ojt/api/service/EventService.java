package com.tuanna.ojt.api.service;

import java.util.List;
import java.util.Optional;
import com.tuanna.ojt.api.dto.EventDto;
import com.tuanna.ojt.api.dto.EventRequestDto;

public interface EventService {
  
  List<EventDto> getAll(EventRequestDto eventRequestDto);
  
  Optional<EventDto> getOneBy(EventDto request);
}
