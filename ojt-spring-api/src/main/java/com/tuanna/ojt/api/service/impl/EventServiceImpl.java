package com.tuanna.ojt.api.service.impl;

import java.util.List;
import java.util.Optional;
import org.springframework.stereotype.Service;
import com.tuanna.ojt.api.dto.EventDto;
import com.tuanna.ojt.api.dto.StudentEventRequestDto;
import com.tuanna.ojt.api.service.EventService;

@Service
public class EventServiceImpl implements EventService {

  @Override
  public List<EventDto> getAll(StudentEventRequestDto eventRequestDto) {
    // TODO Auto-generated method stub
    throw new UnsupportedOperationException("Unimplemented method 'getAll'");
  }

  @Override
  public Optional<EventDto> getOneBy(EventDto request) {
    // TODO Auto-generated method stub
    return Optional.empty();
  }



}
