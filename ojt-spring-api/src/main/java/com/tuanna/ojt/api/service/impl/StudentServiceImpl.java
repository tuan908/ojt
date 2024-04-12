package com.tuanna.ojt.api.service.impl;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import java.util.stream.Stream;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Sort.Direction;
import org.springframework.data.jpa.repository.JpaContext;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import com.tuanna.ojt.api.constants.EventStatus;
import com.tuanna.ojt.api.dto.CommentDto;
import com.tuanna.ojt.api.dto.EventDetailDto;
import com.tuanna.ojt.api.dto.HashtagDto;
import com.tuanna.ojt.api.dto.RegisterEventDto;
import com.tuanna.ojt.api.dto.RegisterEventResponseDto;
import com.tuanna.ojt.api.dto.StudentEventRequestDto;
import com.tuanna.ojt.api.dto.StudentEventResponseDto;
import com.tuanna.ojt.api.dto.UpdateEventStatusDto;
import com.tuanna.ojt.api.entity.Comment;
import com.tuanna.ojt.api.entity.EventDetail;
import com.tuanna.ojt.api.entity.EventDetail.EventData;
import com.tuanna.ojt.api.entity.Student;
import com.tuanna.ojt.api.repository.EventDetailRepository;
import com.tuanna.ojt.api.repository.EventRepository;
import com.tuanna.ojt.api.repository.GradeRepository;
import com.tuanna.ojt.api.repository.StudentRepository;
import com.tuanna.ojt.api.service.StudentService;
import jakarta.persistence.EntityManager;

@Service
@Transactional(readOnly = true)
public class StudentServiceImpl implements StudentService {

  private final EntityManager entityManager;

  private final GradeRepository gradeRepository;

  private final EventRepository eventRepository;

  private final StudentRepository studentRepository;

  private final EventDetailRepository eventDetailRepository;

  public StudentServiceImpl(JpaContext jpaContext, GradeRepository gradeRepository,
      EventRepository eventRepository, StudentRepository studentRepository,
      EventDetailRepository eventDetailRepository) {
    this.entityManager = jpaContext.getEntityManagerByManagedType(Student.class);
    this.gradeRepository = gradeRepository;
    this.eventRepository = eventRepository;
    this.studentRepository = studentRepository;
    this.eventDetailRepository = eventDetailRepository;
  };

  @Override
  public Page<StudentEventResponseDto> getEventList(StudentEventRequestDto dto) {
    Map<String, Object> parameters = new HashMap<String, Object>();
    var qlString = """
            select
              s
            from
              com.tuanna.ojt.api.entity.Student s
              left join fetch s.events
              left join fetch s.hashtags
            where
              1 = 1
        """;

    if (StringUtils.hasText(dto.name())) {
      qlString += " and s.name = :studentName";
      parameters.put("studentName", dto.name());
    }

    if (StringUtils.hasText(dto.grade())) {
      qlString += " and s.grade.name = :grade";
      parameters.put("grade", dto.grade());
    }

    if (StringUtils.hasText(dto.event())) {
      qlString += " and element(s.events) in :eventName ";
      parameters.put("eventName", dto.event());
    }

    if (dto.hashtags() != null && dto.hashtags().size() > 0) {
      qlString += " and element(s.hashtags).name in :hashtags ";
      parameters.put("hashtagList", dto.hashtags());
    }

    qlString += " order by s.code  ";

    var query = this.entityManager.createQuery(qlString, Student.class);

    for (String key : parameters.keySet()) {
      query.setParameter(key, parameters.get(key));
    }

    var students = query.getResultList();
    // @formatter:off
    var list = students.stream()
      .map(student -> {
          var events = student.getEvents().stream()
            .map(event -> {
                var eventDto = new EventDetailDto(
                  event.getId(),
                  event.getGrade().getName(),
                  !StringUtils.hasText(event.getDetail().getName())
                        ? ""
                        : event.getDetail().getName(),
                  event.getStatus().getValue(),
                  event.getData(),
                  event.getComments().stream().map(Comment::toDto).toList()
                );
                return eventDto;
              })
            .sorted(Comparator.comparing(EventDetailDto::name))
            .toList();

          var hashtags = student.getHashtags().stream()
            .map(hashtag -> {
                var hashtagDto = new HashtagDto(hashtag.getId(), hashtag.getName(), hashtag.getColor());
                return hashtagDto;
              })
            .sorted(Comparator.comparing(HashtagDto::name))
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
  public StudentEventResponseDto getEventsByStudentCode(String code) {
    var student = this.studentRepository.findByCode(code).orElse(null);

    if (student != null) {
      // @formatter:off
      var events = student.getEvents().stream()
        .filter(event -> !event.getIsDeleted())
        .sorted(Comparator.comparing(EventDetail::getCreatedAt))
        .map(event -> {
            var eventComments = event.getComments().stream()
              .filter(comment -> !comment.getIsDeleted())
              .map(Comment::toDto)
              .sorted(Comparator.comparing(CommentDto::createdAt))
              .toList();

            var eventDto = new EventDetailDto(
                event.getId(),
                event.getGrade().getName(),
                event.getDetail().getName(),
                event.getStatus().getValue(),
                event.getData(),
                eventComments
            );
            return eventDto;
          })
        .toList();

      var hashtags = student.getHashtags().stream()
        .map(hashtag -> {
            var hashtagDto = new HashtagDto(
              hashtag.getId(),
              hashtag.getName(),
              hashtag.getColor()
            );
            return hashtagDto;
          })
        .sorted(Comparator.comparing(HashtagDto::name))
        .toList();


      var result = new StudentEventResponseDto(
            student.getCode(), 
            student.getName(),
            student.getGrade().getName(), 
            events, 
            hashtags
          );
      // @formatter:on
      return result;
    }
    return null;

  }

  @Override
  @Transactional
  public Boolean updateEventStatus(UpdateEventStatusDto dto) {
    var qlString = """
            update
              com.tuanna.ojt.api.entity.Event
            set
              status = :status,
              updatedBy = :updatedBy,
              updatedAt = :updatedAt
            where
              id = : id
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
  public RegisterEventResponseDto registerOrUpdateEvent(RegisterEventDto dto) {
    var student = this.studentRepository.findByUsername(dto.username()).orElse(null);

    var detail = this.eventRepository.findByName(dto.data().eventName()).orElse(null);

    var grade = this.gradeRepository.findByName(dto.gradeName()).orElse(null);


    if (student == null || detail == null || grade == null) {
      return null;
    }
    var qlString = """
            select
              e
            from
              com.tuanna.ojt.api.entity.EventDetail e
            where
              e.student.code = :code
              and e.student.grade.name = :gradeName
              and e.detail.name = :eventName
        """;
    var query = this.entityManager.createQuery(qlString, EventDetail.class);
    query.setParameter("code", student.getCode());
    query.setParameter("gradeName", grade.getName());
    query.setParameter("eventName", detail.getName());

    var result = query.getResultStream().findFirst();

    EventDetail event = null;
    if (result.isEmpty()) {

      var data = new EventDetail.EventData();
      data.setEventName(dto.data().eventName());
      data.setEventsInSchoolLife(dto.data().eventsInSchoolLife());
      data.setMyAction(dto.data().myAction());
      data.setMyThought(dto.data().myThought());
      data.setShownPower(dto.data().shownPower());
      data.setStrengthGrown(dto.data().strengthGrown());

    // @formatter:off
      event = EventDetail.builder()
          .status(EventStatus.UNCONFIRMED)
          .detail(detail)
          .grade(grade)
          .data(data)
          .createdBy(dto.username())
          .updatedBy(dto.username())
          .student(student)
          .build();
      // @formatter:on
    } else {
      event = result.get();
      var eventData = event.getData();
      // @formatter:off
      eventData = EventData.builder()
          .eventName(dto.data().eventName())
          .eventsInSchoolLife(dto.data().eventsInSchoolLife())
          .myAction(dto.data().myAction())
          .myThought(dto.data().myThought())
          .shownPower(dto.data().shownPower())
          .strengthGrown(dto.data().strengthGrown())
          .build();
      // @formatter:on
      event.setData(eventData);
    }

    this.entityManager.persist(event);
    this.entityManager.flush();
    var response = new RegisterEventResponseDto(event.getId());
    return response;
  }

  @Override
  public EventDetailDto getStudentEventById(@NonNull Long id) {
    var eventDetail = this.eventDetailRepository.findById(id).orElse(null);
    if (eventDetail != null) {
      var eventDto = eventDetail.toDto();
      return eventDto;
    }
    return null;
  }

  @Override
  @Transactional
  public List<EventDetailDto> deleteEventById(String code, @NonNull Long id) {

    var event = this.eventDetailRepository.findById(id).orElse(null);

    if (event != null) {
      event.setIsDeleted(Boolean.TRUE);
      this.eventDetailRepository.saveAndFlush(event);
    }


    var student = this.studentRepository.findByCode(code).orElse(null);

    if (student != null) {
      // @formatter:off
      return student.getEvents().stream()
          .filter(ev -> !ev.getIsDeleted())
          .sorted(Comparator.comparing(EventDetail::getCreatedAt))
          .map(EventDetail::toDto)
          .toList();
      // @formatter:on
    }

    return new ArrayList<>();


  }

  @Override
  public List<EventDetailDto> getEventsByStudentCode(String code, String grade, String eventName,
      String status) {
    Map<String, Object> parameters = new HashMap<String, Object>();
    var qlString = """
        select
            ed
        from
            com.tuanna.ojt.api.entity.EventDetail ed
            left join fetch ed.comments
        where
            ed.student.code = :code
            and ed.isDeleted = false
        """;

    if (StringUtils.hasText(grade)) {
      qlString += " and ed.grade.name = :grade";
      parameters.put("grade", grade);
    }

    if (StringUtils.hasText(eventName)) {
      qlString += " and ed.detail.name = :eventName";
      parameters.put("eventName", eventName);
    }

    if (StringUtils.hasText(status)) {
      qlString += " and ed.status in :status ";
      var converted = Stream.of(status.split(",")).map(x -> {
        return switch (Integer.valueOf(x)) {
          case 1:
            yield EventStatus.UNCONFIRMED;

          case 2:
            yield EventStatus.UNDER_REVIEW;

          case 3:
            yield EventStatus.COMPLETED;

          default:
            yield new Exception("Invalid event status");
        };
      }).collect(Collectors.toList());
      parameters.put("status", converted);
    }

    qlString += " order by ed.createdAt ";

    var query = this.entityManager.createQuery(qlString, EventDetail.class);

    for (String key : parameters.keySet()) {
      query.setParameter(key, parameters.get(key));
    }
    query.setParameter("code", code);

    var data = query.getResultStream().map(EventDetail::toDto).toList();
    return data;
  }

}
