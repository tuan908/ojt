package com.tuanna.api.service.impl;

import java.util.List;
import org.springframework.stereotype.Service;
import com.tuanna.api.dto.EventDto;
import com.tuanna.api.dto.GradeDto;
import com.tuanna.api.dto.HashtagDto;
import com.tuanna.api.entity.Event;
import com.tuanna.api.entity.Grade;
import com.tuanna.api.service.CommonService;
import jakarta.persistence.EntityManager;

@Service
public class CommonServiceImpl implements CommonService {

  private final EntityManager entityManager;

  public CommonServiceImpl(EntityManager entityManager) {
    super();
    this.entityManager = entityManager;
  }

  @Override
  public List<EventDto> getEvents() {
    var sb = new StringBuffer();
    sb.append("select ");
    sb.append("new com.tuanna.api.dto.EventDto(e.id, e.name)");
    sb.append("from");
    sb.append("com.tuanna.api.entity.Event e");

    var query = this.entityManager.createQuery(sb.toString(), EventDto.class);
    var queryResult = query.getResultList();
    return queryResult;
  }

  @Override
  public List<HashtagDto> getHashtags() {
    var sb = new StringBuffer();
    sb.append("select ");
    sb.append("new com.tuanna.api.dto.HashtagDto(e.id, e.name)");
    sb.append("from");
    sb.append("com.tuanna.api.entity.Hashtag e");

    var query = this.entityManager.createQuery(sb.toString(), HashtagDto.class);
    var queryResult = query.getResultList();
    return queryResult;
  }

  @Override
  public List<GradeDto> getGrades() {
    var sb = new StringBuffer();
    sb.append("select ");
    sb.append("new com.tuanna.api.dto.GradeDto(e.id, e.name)");
    sb.append("from");
    sb.append("com.tuanna.api.entity.Grade e");

    var query = this.entityManager.createQuery(sb.toString(), GradeDto.class);
    var queryResult = query.getResultList();
    return queryResult;
  }

  @Override
  public Event findEventByName(String name) {
    var sb = new StringBuffer();
    sb.append("select                           ");
    sb.append(" e                               ");
    sb.append("from                             ");
    sb.append(" com.tuanna.api.entity.Event e   ");
    sb.append("where                            ");
    sb.append(" e.name = :name                  ");

    var query = this.entityManager.createQuery(sb.toString(), Event.class);
    query.setParameter("name", name);
    var queryResult = query.getResultStream().findFirst().orElse(null);
    return queryResult;
  }

  @Override
  public Grade findGradeByName(String name) {
    var sb = new StringBuffer();
    sb.append("select                           ");
    sb.append(" e                               ");
    sb.append("from                             ");
    sb.append(" com.tuanna.api.entity.Grade e   ");
    sb.append("where                            ");
    sb.append(" e.name = :name                  ");

    var query = this.entityManager.createQuery(sb.toString(), Grade.class);
    query.setParameter("name", name);
    var queryResult = query.getResultStream().findFirst().orElse(null);
    return queryResult;
  }

}
