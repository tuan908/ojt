package com.tuanna.ojt.api.service.impl;

import java.util.List;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.tuanna.ojt.api.dto.EventDto;
import com.tuanna.ojt.api.dto.GradeDto;
import com.tuanna.ojt.api.dto.HashtagDto;
import com.tuanna.ojt.api.entity.Event;
import com.tuanna.ojt.api.entity.Grade;
import com.tuanna.ojt.api.entity.Hashtag;
import com.tuanna.ojt.api.service.CommonService;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.TypedQuery;

@Service
@Transactional(readOnly = true)
public class CommonServiceImpl implements CommonService {

  @PersistenceContext
  private EntityManager entityManager;

  @Override
  @Cacheable("grades")
  public List<GradeDto> getGrades() {
    return this.entityManager
        .createQuery("select g from com.tuanna.ojt.api.entity.Grade g", Grade.class).getResultStream()
        .map(Grade::toDto).toList();
  }

  @Override
  @Cacheable("events")
  public List<EventDto> getEvents() {
    return this.entityManager
        .createQuery("select e from com.tuanna.ojt.api.entity.Event e", Event.class)
        .getResultStream().map(Event::toDto).toList();
  }

  @Override
  @Cacheable("hashtags")
  public List<HashtagDto> getHashtags() {
    return this.entityManager
        .createQuery("select h from com.tuanna.ojt.api.entity.Hashtag h", Hashtag.class)
        .getResultStream().map(Hashtag::toDto).toList();
  }

  @Override
  public Event findEventByName(String name) {
    TypedQuery<Event> query = this.entityManager.createQuery(
        "select e from com.tuanna.ojt.entity.Event e where e.name = :name", Event.class);
    query.setParameter("name", name);
    return query.getResultStream().findFirst().orElse(null);
  }

  @Override
  public Grade findGradeByName(String name) {
    TypedQuery<Grade> query = this.entityManager.createQuery(
        "select e from com.tuanna.ojt.entity.Grade e where e.name = :name", Grade.class);
    query.setParameter("name", name);
    return query.getResultStream().findFirst().orElse(null);
  }

}
