package com.tuanna.ojt.api.service.impl;

import java.util.List;
import org.springframework.data.jpa.repository.JpaContext;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.tuanna.ojt.api.dto.EventDto;
import com.tuanna.ojt.api.entity.Event;
import com.tuanna.ojt.api.service.EventService;
import jakarta.persistence.EntityManager;

@Service
@Transactional(readOnly = true)
public class EventServiceImpl implements EventService {

  private final EntityManager entityManager;

  public EventServiceImpl(final JpaContext ctx) {
    this.entityManager = ctx.getEntityManagerByManagedType(Event.class);
  }

  @Override
  public List<EventDto> getAll() {
    var qlString = """
		  	select 
    		  	e 
		  	from 
    		  	com.tuanna.ojt.api.entity.Event e
		""";

    var query = this.entityManager.createQuery(qlString, Event.class);
    var list = query.getResultStream().map(Event::toDto).toList();

    return list;
  }

}
