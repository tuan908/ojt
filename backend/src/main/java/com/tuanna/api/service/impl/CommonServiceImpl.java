package com.tuanna.api.service.impl;

import java.util.List;

import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.tuanna.api.dto.EventDto;
import com.tuanna.api.dto.GradeDto;
import com.tuanna.api.dto.HashtagDto;
import com.tuanna.api.entity.Event;
import com.tuanna.api.entity.Grade;
import com.tuanna.api.service.CommonService;

import jakarta.persistence.EntityManager;
import jakarta.persistence.TypedQuery;

@Service
@Transactional(readOnly = true)
public class CommonServiceImpl implements CommonService {

  private final EntityManager entityManager;

  public CommonServiceImpl(EntityManager entityManager) {
    super();
    this.entityManager = entityManager;
  }

  @Override
  @Cacheable("grades")
  public List<GradeDto> getGrades() {
    StringBuffer stringBuffer = new StringBuffer();

    stringBuffer.append("select                                             ");
    stringBuffer.append("     new com.tuanna.api.dto.GradeDto(e.id, e.name) ");
    stringBuffer.append("from                                               ");
    stringBuffer.append("     com.tuanna.api.entity.Grade e                 ");

    return this.entityManager.createQuery(stringBuffer.toString(), GradeDto.class).getResultStream()
        .toList();
  }

  @Override
  @Cacheable("events")
  public List<EventDto> getEvents() {
    StringBuffer stringBuffer = new StringBuffer();

    stringBuffer.append("select                                             ");
    stringBuffer.append("     new com.tuanna.api.dto.EventDto(e.id, e.name) ");
    stringBuffer.append("from                                               ");
    stringBuffer.append("     com.tuanna.api.entity.Event e                 ");

    return this.entityManager.createQuery(stringBuffer.toString(), EventDto.class).getResultStream()
        .toList();
  }

  @Override
  @Cacheable("hashtags")
  public List<HashtagDto> getHashtags() {
    StringBuffer stringBuffer = new StringBuffer();

    stringBuffer.append("select                                               ");
    stringBuffer.append("     new com.tuanna.api.dto.HashtagDto(e.id, e.name) ");
    stringBuffer.append("from                                                 ");
    stringBuffer.append("     com.tuanna.api.entity.Hashtag e                 ");

    return this.entityManager
        .createQuery("select h from com.tuanna.api.entity.Hashtag h", HashtagDto.class)
        .getResultStream().toList();
  }

  @Override
  public Event findEventByName(String name) {
    StringBuffer sb = new StringBuffer();

    sb.append("select                             ");
    sb.append("     e                             ");
    sb.append("from                               ");
    sb.append("     com.tuanna.api.entity.Event e ");
    sb.append("where                              ");
    sb.append("     e.name = :name                ");

    TypedQuery<Event> query = this.entityManager.createQuery(sb.toString(), Event.class);
    query.setParameter("name", name);
    return query.getResultStream().findFirst().orElse(null);
  }

  @Override
  public Grade findGradeByName(String name) {
    TypedQuery<Grade> query = this.entityManager.createQuery(
        "select e from com.tuanna.api.entity.Grade e where e.name = :name", Grade.class);
    query.setParameter("name", name);
    return query.getResultStream().findFirst().orElse(null);
  }

}
