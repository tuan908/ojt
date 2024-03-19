package com.tuanna.ojt.api.service.impl;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Sort.Direction;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import com.tuanna.ojt.api.dto.EventDetailDto;
import com.tuanna.ojt.api.dto.EventDto;
import com.tuanna.ojt.api.dto.HashtagDto;
import com.tuanna.ojt.api.dto.StudentEventDetailResponseDto;
import com.tuanna.ojt.api.dto.StudentEventRequestDto;
import com.tuanna.ojt.api.dto.StudentEventResponseDto;
import com.tuanna.ojt.api.entity.Comment;
import com.tuanna.ojt.api.entity.Student;
import com.tuanna.ojt.api.service.StudentService;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;

@Service
@Transactional(readOnly = true)
public class StudentServiceImpl implements StudentService {

  @PersistenceContext
  private EntityManager entityManager;

  @Override
  public Page<StudentEventResponseDto> getAll(StudentEventRequestDto dto) {
    Map<String, Object> parameters = new HashMap<String, Object>();
    var qlString = """
        select
                s
        from
                com.tuanna.ojt.api.entity.Student s
        join fetch
                s.grade
        join fetch
                s.eventList
        join fetch
                s.hashtagList
        where
                1 = 1
                """;

    if (StringUtils.hasText(dto.studentName())) {
      qlString += " and s.name = :studentName";
      parameters.put("studentName", dto.studentName());
    }

    if (StringUtils.hasText(dto.schoolYear())) {
      qlString += " and s.gradeLevel = :gradeLevel";
      parameters.put("gradeLevel", dto.schoolYear());
    }

    if (StringUtils.hasText(dto.event())) {
      qlString += " and element(s.eventList) in :eventName ";
      parameters.put("eventName", dto.event());
    }

    if (dto.hashtags() != null && dto.hashtags().size() > 0) {
      qlString += " and element(s.hashtagList).name in :hashtagList ";
      parameters.put("hashtagList", dto.hashtags());
    }

    var query = this.entityManager.createQuery(qlString, Student.class);

    for (String key : parameters.keySet()) {
      query.setParameter(key, parameters.get(key));
    }

    var students = query.getResultList();
    // @formatter:off
    var list = students.stream()
      .map(student -> {
          var events = student.getEventList().stream()
            .map(event -> {
                var eventDto = new EventDto(event.getId(), event.getDetail().getName());
                return eventDto;
              })
            .toList();
          
          List<HashtagDto> hashtags = student.getHashtagList().stream()
            .map(hashtag -> {
                var hashtagDto = new HashtagDto(hashtag.getId(), hashtag.getName(), hashtag.getColor());
                return hashtagDto;
              })
            .toList();
          
          var responseDto = new StudentEventResponseDto(
                student.getCode(),
                student.getName(),
                student.getGrade().getName(),
                events,
                hashtags
              );
          return responseDto;
        })
      .toList();
    // @formatter:on
    // var list = this.studentRepository.findAll();
    PageRequest pageRequest = PageRequest.of(dto.page(), 10, Sort.by(Direction.ASC, "code"));
    var result = new PageImpl<StudentEventResponseDto>(list, pageRequest, list.size());
    return result;
  }

  @Override
  public StudentEventDetailResponseDto getByCode(String code) {
    var qlString = """
        select
                s
        from
                com.tuanna.ojt.api.entity.Student s
        join fetch
                s.eventList
        where
                1 = 1
        and
                s.code = ?1
                """;
    var query = this.entityManager.createQuery(qlString, Student.class);
    query.setParameter(1, code);
    var student = query.getResultStream().findFirst().orElse(null);

    if (student != null) {
      // @formatter:off
      var events = student.getEventList().stream()
        .map(event -> {
            var eventComments = event.getComments().stream()
              .map(Comment::toDto)
              .toList();

            var eventDto = new EventDetailDto(
                event.getId(), 
                event.getDetail().getName(),
                event.getStatus().getValue(), 
                eventComments
            );
            return eventDto;
          })
        .collect(Collectors.toUnmodifiableList());

      var hashtags = student.getHashtagList().stream()
        .map(hashtag -> {
            var hashtagDto = new HashtagDto(
              hashtag.getId(), 
              hashtag.getName(), 
              hashtag.getColor()
            );
            return hashtagDto;
          })
        .toList();
      // @formatter:on

      var result =
          new StudentEventDetailResponseDto(student.getCode(), student.getName(), events, hashtags);
      return result;
    }
    return null;

  }

}
