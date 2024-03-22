package com.tuanna.ojt.api.service.impl;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.tuanna.ojt.api.constants.EventStatus;
import com.tuanna.ojt.api.dto.EventDto;
import com.tuanna.ojt.api.dto.RegisterEventDto;
import com.tuanna.ojt.api.dto.UpdateEventStatusDto;
import com.tuanna.ojt.api.entity.Event;
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

  @Override
  @Transactional
  public Boolean updateStatus(UpdateEventStatusDto dto) {
    var qlString = """
          update
            com.tuanna.ojt.api.entity.Event
          set
            status = :status, updatedBy = :updatedBy, updatedAt = :updatedAt
          where
            id = :id
        """;
    var query = this.entityManager.createQuery(qlString);
    query.setParameter("status", EventStatus.COMPLETED);
    query.setParameter("id", dto.id());
    query.setParameter("updatedBy", dto.updatedBy());
    query.setParameter("updatedAt", LocalDateTime.now(ZoneId.of("UTC+7")));

    var result = query.executeUpdate();

    return result > 0 ? Boolean.TRUE : Boolean.FALSE;
  }

  @Override
  public Object register(RegisterEventDto dto) {
    var event = new Event();
    event.setData(dto.data());
    this.entityManager.persist(event);
    return null;
  }

}
