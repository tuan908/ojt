package com.tuanna.ojt.api.service;

import java.util.List;
import com.tuanna.ojt.api.dto.EventDto;
import com.tuanna.ojt.api.dto.RegisterEventDto;
import com.tuanna.ojt.api.dto.UpdateEventStatusDto;

public interface EventDetailService {
  
  List<EventDto> getAll();

  Boolean updateStatus(UpdateEventStatusDto dto);

  Object register(RegisterEventDto dto);
 
}
