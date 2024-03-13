package com.tuanna.ojt.api.event;

import java.util.List;
import java.util.Optional;
import org.springframework.stereotype.Service;

@Service
public class EventServiceImpl implements EventService {

  @Override
  public List<EventDto> getAll(EventRequestDto eventRequestDto) {
    // TODO Auto-generated method stub
    throw new UnsupportedOperationException("Unimplemented method 'getAll'");
  }

  @Override
  public Optional<EventDto> getOneBy(EventDto request) {
    // TODO Auto-generated method stub
    return Optional.empty();
  }



}
