package com.tuanna.ojt.api.service.impl;

import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.tuanna.ojt.api.dto.EventDto;
import com.tuanna.ojt.api.entity.EventDetail;
import com.tuanna.ojt.api.service.EventDetailService;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;

@Service
@Transactional(readOnly = true)
public class EventDetailServiceImpl implements EventDetailService {
  
  @PersistenceContext
  private EntityManager entityManager;

  @Override
  public List<EventDto> getAll() {
    var qlString = "select e from com.tuanna.ojt.api.entity.EventDetail e";
    
    var query = this.entityManager.createQuery(qlString, EventDetail.class);
    
    var list = query.getResultStream().map(EventDetail::toDto).toList();
    
    return list;
  }

}
