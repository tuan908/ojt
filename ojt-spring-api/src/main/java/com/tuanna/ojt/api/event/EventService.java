package com.tuanna.ojt.api.event;

import java.util.List;
import java.util.Optional;

public interface EventService {
  
  List<EventDto> getAll(EventRequestDto eventRequestDto);
  
  Optional<EventDto> getOneBy(EventDto request);
}
