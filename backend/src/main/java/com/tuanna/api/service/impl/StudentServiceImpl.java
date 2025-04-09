package com.tuanna.api.service.impl;

import java.util.HashMap;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import org.hibernate.Session;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.tuanna.api.constant.EventStatus;
import com.tuanna.api.dto.ApiResponse;
import com.tuanna.api.dto.Pagination;
import com.tuanna.api.dto.StudentDto;
import com.tuanna.api.dto.StudentsDto;
import com.tuanna.api.dto.StudentEventRequestDto;
import com.tuanna.api.dto.StudentEventsDto;
import com.tuanna.api.entity.Student;
import com.tuanna.api.entity.StudentEvent;
import com.tuanna.api.service.StudentService;
import io.jsonwebtoken.lang.Collections;
import jakarta.persistence.EntityManager;
import jakarta.persistence.TypedQuery;

@Service
@Transactional(readOnly = true)
public class StudentServiceImpl implements StudentService {

  private final @NonNull EntityManager entityManager;

  public StudentServiceImpl(EntityManager entityManager, ObjectMapper mapper) {
    this.entityManager = entityManager;
  }

  @Override
  public ApiResponse<List<StudentsDto>> findAll(StudentEventRequestDto dto) {
    var parameters = new HashMap<String, Object>();
    var sql = new StringBuffer();
    sql.append(" select ");
    sql.append(" distinct s ");
    sql.append(" from ");
    sql.append(" com.tuanna.api.entity.Student s ");
    sql.append(" left join fetch s.studentEvents ev ");
    sql.append(" left join fetch ev.event ");
    sql.append(" left join fetch s.user u ");
    sql.append(" left join fetch s.grade g ");
    sql.append(" left join fetch s.studentHashtags sh ");
    sql.append(" left join fetch sh.hashtag h ");

    var whereClause = new StringBuffer(" where 1 = 1");

    if (StringUtils.hasText(dto.name())) {
      whereClause.append(" and u.name like concat('%', :studentName, '%')");
      parameters.put("studentName", dto.name());
    }

    if (StringUtils.hasText(dto.grade())) {
      whereClause.append(" and g.name = :grade");
      parameters.put("grade", dto.grade());
    }

    if (StringUtils.hasText(dto.event())) {
      whereClause.append(" and exists (select e from ev.event e where e.name = :eventName)");
      parameters.put("eventName", dto.event());
    }

    if (dto.hashtags() != null && !dto.hashtags().isEmpty()) {
      whereClause.append(" and exists (");
      whereClause.append("SELECT ht                                     ");
      whereClause.append("FROM com.tuanna.api.entity.StudentHashtag sh2 ");
      whereClause.append("JOIN sh.hashtag ht                            ");
      whereClause.append("WHERE sh2 = sh AND ht.name IN :hashtags       ");
      whereClause.append(")");
      parameters.put("hashtags", dto.hashtags());
    }

    sql.append(whereClause).append(" order by s.code");

    // Batch Processing Optimization
    var session = entityManager.unwrap(Session.class);
    session.setJdbcBatchSize(100);

    TypedQuery<Student> query = entityManager.createQuery(sql.toString(), Student.class);
    parameters.forEach(query::setParameter);

    query.setFirstResult((dto.page() - 1) * dto.limit());
    query.setMaxResults(dto.limit());

    List<StudentsDto> data = query.getResultList().stream().map(Student::toDto).toList();

    // Count Query for Total Records
    var countSql =
        new StringBuffer("select count(distinct s) from com.tuanna.api.entity.Student s ");
    // Add necessary joins for the count query
    if (StringUtils.hasText(dto.name())) {
      countSql.append(" left join s.user u ");
    }
    if (StringUtils.hasText(dto.grade())) {
      countSql.append(" left join s.grade g ");
    }
    if (StringUtils.hasText(dto.event())) {
      countSql.append(" left join s.studentEvents ev left join ev.event ");
    }
    if (dto.hashtags() != null && !dto.hashtags().isEmpty()) {
      countSql.append(" left join s.studentHashtags ht ");
    }
    countSql.append(whereClause);
    TypedQuery<Long> countQuery = entityManager.createQuery(countSql.toString(), Long.class);
    parameters.forEach(countQuery::setParameter);
    long totalElements = countQuery.getSingleResult();

    // API Response using custom paging
    return ApiResponse.paginated(data, null, Pagination.of(dto.page(), dto.limit(), totalElements));
  }

  @Override
  public ApiResponse<List<StudentDto.EventData>> findByStudentCode(StudentEventsDto request) {
    var parameters = new HashMap<String, Object>();
    var stringBuffer = new StringBuffer();

    var qlString = """
          select
            se
          from
            com.tuanna.api.entity.StudentEvent se
            right join fetch se.student s
            join fetch se.event e
            join fetch se.grade g
            left join fetch se.comments
          where
            s.code = :code
        """;

    stringBuffer.append(qlString);

    if (StringUtils.hasText(request.grade())) {
      stringBuffer.append(" and g.name = :grade");
      parameters.put("grade", request.grade());
    }

    if (StringUtils.hasText(request.eventName())) {
      stringBuffer.append(" and e.name = :eventName");
      parameters.put("eventName", request.eventName());
    }

    if (StringUtils.hasText(request.status())) {
      stringBuffer.append(" and se.eventStatus in :status ");
      List<EventStatus> converted = Stream.of(request.status().split(","))
          .map(x -> EventStatus.fromShortName(Integer.valueOf(x))).collect(Collectors.toList());
      parameters.put("status", converted);
    }
    stringBuffer.append(" order by se.createdAt ");

    TypedQuery<StudentEvent> query =
        this.entityManager.createQuery(stringBuffer.toString(), StudentEvent.class);

    for (String key : parameters.keySet()) {
      query.setParameter(key, parameters.get(key));
    }
    query.setParameter("code", request.studentCode());
    var firstResult = (request.page() - 1) * request.size();
    query.setFirstResult(firstResult);
    query.setMaxResults(request.size());
    var queryResults = query.getResultList();
    var pagination = Pagination.of(request.page(), request.size(), queryResults.size());

    if (queryResults.size() == 0)
      return ApiResponse.paginated(Collections.emptyList(), null, pagination);

    var events = queryResults.stream().map(StudentEvent::toEventDataDto).toList();
    return ApiResponse.paginated(events, null, pagination);
  }
}
