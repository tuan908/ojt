package com.tuanna.ojt.api.service.impl;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.List;

import org.springframework.data.jpa.repository.JpaContext;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.tuanna.ojt.api.constants.EventStatus;
import com.tuanna.ojt.api.dto.EventDto;
import com.tuanna.ojt.api.dto.RegisterEventDto;
import com.tuanna.ojt.api.dto.RegisterEventResponseDto;
import com.tuanna.ojt.api.dto.UpdateEventStatusDto;
import com.tuanna.ojt.api.entity.Event;
import com.tuanna.ojt.api.entity.EventDetail;
import com.tuanna.ojt.api.repository.EventDetailRepository;
import com.tuanna.ojt.api.repository.GradeRepository;
import com.tuanna.ojt.api.service.EventDetailService;

import jakarta.persistence.EntityManager;

@Service
@Transactional(readOnly = true)
public class EventDetailServiceImpl implements EventDetailService {

  private final EntityManager entityManager;

  private final EventDetailRepository eventDetailRepository;

  private final GradeRepository gradeRepository;

  public EventDetailServiceImpl(JpaContext jpaContext, EventDetailRepository eventDetailRepository,
      GradeRepository gradeRepository) {
    this.entityManager = jpaContext.getEntityManagerByManagedType(EventDetail.class);
    this.eventDetailRepository = eventDetailRepository;
    this.gradeRepository = gradeRepository;
  }

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
  @Transactional
  public RegisterEventResponseDto register(RegisterEventDto dto) {

    var detail = this.eventDetailRepository.findById(dto.getEventDetailId());

    var grade = this.gradeRepository.findByName(dto.getGradeName());

    // @formatter:off
    var event = Event.builder()
        .status(EventStatus.UNCONFIRMED)
        .detail(detail.orElse(null))
        .grade(grade.orElse(null))
        .data(dto.getData())
        .createdBy(dto.getUsername())
        .updatedBy(dto.getUsername())
        .build();
    // @formatter:on

    this.entityManager.persist(event);
    var response = new RegisterEventResponseDto(event.getId());
    return response;
  }

}
