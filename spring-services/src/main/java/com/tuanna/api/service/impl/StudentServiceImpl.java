package com.tuanna.api.service.impl;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import org.hibernate.Session;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PagedModel;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import com.tuanna.api.constant.EventStatus;
import com.tuanna.api.dto.ApiResponse;
import com.tuanna.api.dto.EventDetailDto;
import com.tuanna.api.dto.Pagination;
import com.tuanna.api.dto.RegisterEventDto;
import com.tuanna.api.dto.RegisterEventResponseDto;
import com.tuanna.api.dto.StudentEventDto;
import com.tuanna.api.dto.StudentEventRequestDto;
import com.tuanna.api.dto.StudentEventsDto;
import com.tuanna.api.dto.UpdateEventStatusDto;
import com.tuanna.api.entity.EventDetail;
import com.tuanna.api.entity.Student;
import com.tuanna.api.repository.EventDetailRepository;
import com.tuanna.api.repository.StudentRepository;
import com.tuanna.api.service.CommonService;
import com.tuanna.api.service.StudentService;

import jakarta.persistence.EntityManager;
import jakarta.persistence.Query;
import jakarta.persistence.TypedQuery;

@Service
@Transactional(readOnly = true)
public class StudentServiceImpl implements StudentService {

  private final @NonNull EntityManager entityManager;

  private final @NonNull StudentRepository studentRepository;

  private final @NonNull EventDetailRepository eventDetailRepository;

  private final @NonNull CommonService commonService;

  public StudentServiceImpl(
      EntityManager entityManager,
      StudentRepository studentRepository,
      EventDetailRepository eventDetailRepository,
      CommonService commonService) {
    this.entityManager = entityManager;
    this.studentRepository = studentRepository;
    this.eventDetailRepository = eventDetailRepository;
    this.commonService = commonService;
  }

  @Override
  @Cacheable(value = "students", key = "#dto != null ? #dto.toString() : 'defaultKey'") // Redis
                                                                                        // caching
  public ApiResponse<List<StudentEventDto>> findAll(StudentEventRequestDto dto) {
    var parameters = new HashMap<String, Object>();
    var sql = new StringBuilder("""
        select distinct s from com.tuanna.api.entity.Student s
        join fetch s.events ev
        join fetch ev.detail
        join fetch s.user u
        join fetch s.grade g
        join fetch s.hashtags h
        """);

    var whereClause = new StringBuilder(" where 1 = 1");

    if (StringUtils.hasText(dto.name())) {
      whereClause.append(" and s.user.name = :studentName");
      parameters.put("studentName", dto.name());
    }

    if (StringUtils.hasText(dto.grade())) {
      whereClause.append(" and s.grade.name = :grade");
      parameters.put("grade", dto.grade());
    }

    if (StringUtils.hasText(dto.event())) {
      whereClause.append(" and exists (select e from s.events e where e.name = :eventName)");
      parameters.put("eventName", dto.event());
    }

    if (dto.hashtags() != null && !dto.hashtags().isEmpty()) {
      whereClause.append(" and exists (select h from s.hashtags h where h.name in :hashtags)");
      parameters.put("hashtags", dto.hashtags());
    }

    sql.append(whereClause).append(" order by s.code");

    // Batch Processing Optimization
    var session = entityManager.unwrap(Session.class);
    session.setJdbcBatchSize(100);

    TypedQuery<Student> query = entityManager.createQuery(sql.toString(), Student.class);
    parameters.forEach(query::setParameter);

    query.setFirstResult((dto.pageNumber() - 1) * dto.pageSize());
    query.setMaxResults(dto.pageSize());

    List<StudentEventDto> data = query.getResultList().stream().map(Student::toDto).toList();

    // Count Query for Total Records
    var countSql =
        new StringBuilder("select count(distinct s) from com.tuanna.api.entity.Student s ");
    countSql.append(whereClause);
    TypedQuery<Long> countQuery = entityManager.createQuery(countSql.toString(), Long.class);
    parameters.forEach(countQuery::setParameter);
    long totalElements = countQuery.getSingleResult();

    // API Response using custom paging
    return ApiResponse
        .paginated(data, null, Pagination.of(dto.pageNumber(), dto.pageSize(), totalElements));
  }

  @Override
  @Transactional
  public Boolean updateEventStatus(UpdateEventStatusDto dto) {
    var qlString = """
            update
              com.tuanna.api.entity.EventDetail
            set
              status = :status,
              updatedBy = :updatedBy
            where
              id = :id
        """;
    var query = this.entityManager.createQuery(qlString);
    query.setParameter("id", dto.id());
    query.setParameter("status", EventStatus.COMPLETED);
    query.setParameter("updatedBy", dto.updatedBy());

    int result = query.executeUpdate();

    return result > 0;
  }

  @Override
  @Transactional
  public RegisterEventResponseDto update(RegisterEventDto dto) {
    var student = this.studentRepository.findByUsername(dto.getUsername()).orElse(null);

    var detail = this.commonService.findEventByName(dto.getData().eventName());

    if (student == null || detail == null) {
      return null;
    }
    var qlString = """
            select
              e
            from
              com.tuanna.api.entity.EventDetail e
            where
              e.student.code = :code
              and e.student.grade.name = :gradeName
              and e.detail.name = :eventName
              and e.isDeleted = false
        """;
    var query = this.entityManager.createQuery(qlString, EventDetail.class);
    query.setParameter("code", student.getCode());
    query.setParameter("gradeName", student.getGrade().getName());
    query.setParameter("eventName", detail.getName());

    var result = query.getResultStream().findFirst();

    var event = result.get();
    var eventData = event.getData();

    eventData.setEventName(dto.getData().eventName());
    eventData.setEventsInSchoolLife(dto.getData().eventsInSchoolLife());
    eventData.setMyAction(dto.getData().myAction());
    eventData.setMyThought(dto.getData().myThought());
    eventData.setShownPower(dto.getData().shownPower());
    eventData.setStrengthGrown(dto.getData().strengthGrown());

    event.setData(eventData);

    this.entityManager.persist(event);
    this.entityManager.flush();
    var response = new RegisterEventResponseDto(event.getId());
    return response;
  }

  @Override
  public EventDetailDto findById(@NonNull Long id) {
    var eventDetail = this.eventDetailRepository.findById(id).orElse(null);
    if (eventDetail != null) {
      var eventDto = eventDetail.toDto();
      return eventDto;
    }
    return null;
  }

  @Override
  @Transactional
  public List<EventDetailDto> delete(String code, @NonNull Long id) {
    var event = this.eventDetailRepository.findById(id).orElse(null);

    if (event != null) {
      event.softDelete();
      this.eventDetailRepository.saveAndFlush(event);
    }

    var student = this.studentRepository.findByCode(code).orElse(null);

    if (student != null) {
      return student
          .getEvents()
          .stream()
          .filter(ev -> !ev.getIsDeleted())
          .sorted(Comparator.comparing(EventDetail::getCreatedAt))
          .map(EventDetail::toDto)
          .toList();
    }

    return new ArrayList<>();

  }

  @SuppressWarnings("unchecked")
  @Override
  public PagedModel<EventDetailDto> findEventsByStudentCode(StudentEventsDto request) {
    List<EventDetailDto> data = this.getQuery(request, false).getResultStream().toList();

    var count = this.getQuery(request, true).getSingleResult();

    Pageable pageable = PageRequest.of(request.page() - 1, request.size());

    Page<EventDetailDto> page = new PageImpl<>(data, pageable, data.size());

    return new PagedModel<>(page);
  }

  private Query getQuery(StudentEventsDto request, Boolean isCountQuery) {
    var parameters = new HashMap<String, Object>();
    var stringBuffer = new StringBuffer();
    stringBuffer.append("select											");

    if (!isCountQuery) {
      stringBuffer.append("	ed										");
    } else {
      stringBuffer.append("	count(ed.id)							");
    }

    stringBuffer.append("from											");
    stringBuffer.append("	com.tuanna.api.entity.EventDetail ed	");

    if (!isCountQuery) {
      stringBuffer.append("	left join fetch ed.comments				");
      stringBuffer.append("	join fetch ed.detail					");
    }

    stringBuffer.append("where											");
    stringBuffer.append("	ed.student.code = :code						");
    stringBuffer.append("	and ed.isDeleted = false					");

    if (StringUtils.hasText(request.grade())) {
      stringBuffer.append(" and ed.grade.name = :grade");
      parameters.put("grade", request.grade());
    }

    if (StringUtils.hasText(request.eventName())) {
      stringBuffer.append(" and ed.detail.name = :eventName");
      parameters.put("eventName", request.eventName());
    }

    if (StringUtils.hasText(request.status())) {
      stringBuffer.append(" and ed.status in :status ");
      var converted = Stream.of(request.status().split(",")).map(x -> (switch (Integer.valueOf(x)) {
        case 1:
          yield EventStatus.UNCONFIRMED;

        case 2:
          yield EventStatus.UNDER_REVIEW;

        case 3:
          yield EventStatus.COMPLETED;

        default:
          yield new Exception("Invalid event status");
      })).collect(Collectors.toList());
      parameters.put("status", converted);
    }

    if (!isCountQuery) {
      stringBuffer.append(" order by ed.createdAt ");
    }

    Query query = this.entityManager.createQuery(stringBuffer.toString());;

    for (String key : parameters.keySet()) {
      query.setParameter(key, parameters.get(key));
    }
    query.setParameter("code", request.studentCode());
    var firstResult = (request.page() - 1) * request.size();
    query.setFirstResult(firstResult);
    query.setMaxResults(request.size());

    return query;
  }

  @Override
  @Transactional
  public RegisterEventResponseDto register(RegisterEventDto dto) {
    var student = this.studentRepository.findByUsername(dto.getUsername()).orElse(null);

    var detail = this.commonService.findEventByName(dto.getData().eventName());

    if (student == null || detail == null) {
      return null;
    }
    var qlString = """
            select
              e
            from
              com.tuanna.api.entity.EventDetail e
            where
              e.student.code = :code
              and e.student.grade.name = :gradeName
              and e.detail.name = :eventName
              and e.isDeleted = false
        """;
    var query = this.entityManager.createQuery(qlString, EventDetail.class);
    query.setParameter("code", student.getCode());
    query.setParameter("gradeName", student.getGrade().getName());
    query.setParameter("eventName", detail.getName());

    var result = query.getResultStream().findFirst();

    if (!result.isEmpty()) {
      return null;
    }

    var data = new EventDetail.Data();

    data.setEventName(dto.getData().eventName());
    data.setEventsInSchoolLife(dto.getData().eventsInSchoolLife());
    data.setMyAction(dto.getData().myAction());
    data.setMyThought(dto.getData().myThought());
    data.setShownPower(dto.getData().shownPower());
    data.setStrengthGrown(dto.getData().strengthGrown());

    var event = new EventDetail();

    event.setStatus(EventStatus.UNCONFIRMED);
    event.setDetail(detail);
    event.setGrade(student.getGrade());
    event.setData(data);
    event.setCreatedBy(dto.getUsername());
    event.setStudent(student);

    this.entityManager.persist(event);
    this.entityManager.flush();
    return new RegisterEventResponseDto(event.getId());
  }
}
