package com.tuanna.ojt.api.service.impl;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Sort.Direction;
import org.springframework.data.jpa.repository.JpaContext;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import com.tuanna.ojt.api.constants.EventStatus;
import com.tuanna.ojt.api.dto.AddCommentDto;
import com.tuanna.ojt.api.dto.CommentDto;
import com.tuanna.ojt.api.dto.DeleteCommentDto;
import com.tuanna.ojt.api.dto.EventDetailDto;
import com.tuanna.ojt.api.dto.HashtagDto;
import com.tuanna.ojt.api.dto.RegisterEventDto;
import com.tuanna.ojt.api.dto.RegisterEventResponseDto;
import com.tuanna.ojt.api.dto.StudentEventRequestDto;
import com.tuanna.ojt.api.dto.StudentEventResponseDto;
import com.tuanna.ojt.api.dto.UpdateEventStatusDto;
import com.tuanna.ojt.api.entity.Comment;
import com.tuanna.ojt.api.entity.EventDetail;
import com.tuanna.ojt.api.entity.Student;
import com.tuanna.ojt.api.entity.User;
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

	public StudentServiceImpl(JpaContext jpaCtx, GradeRepository gr, EventRepository ed, StudentRepository sr) {
		this.entityManager = jpaCtx.getEntityManagerByManagedType(Student.class);
		this.gradeRepository = gr;
		this.eventRepository = ed;
		this.studentRepository = sr;
	};

	@Override
	public Page<StudentEventResponseDto> getStudentEventList(StudentEventRequestDto dto) {
		Map<String, Object> parameters = new HashMap<String, Object>();
		var qlString = """
				select
				        s
				from
				        com.tuanna.ojt.api.entity.Student s
				left join fetch
				        s.eventList
				left join fetch
				        s.hashtagList
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
			qlString += " and element(s.eventList) in :eventName ";
			parameters.put("eventName", dto.event());
		}

		if (dto.hashtags() != null && dto.hashtags().size() > 0) {
			qlString += " and element(s.hashtagList).name in :hashtagList ";
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
          var events = student.getEventList().stream()
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

          var hashtags = student.getHashtagList().stream()
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
	public StudentEventResponseDto getStudentEventListByStudentCode(String code) {
		var qlString = """
				select
				        s
				from
				        com.tuanna.ojt.api.entity.Student s
				left join fetch
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
        .sorted(Comparator.comparing(EventDetailDto::id))
        .toList();

      var hashtags = student.getHashtagList().stream()
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
      // @formatter:on

			var result = new StudentEventResponseDto(student.getCode(), student.getName(), student.getGrade().getName(),
					events, hashtags);
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
	public RegisterEventResponseDto registerEvent(RegisterEventDto dto) {
		var student = this.studentRepository.findByUsername(dto.username());

		var detail = this.eventRepository.findByName(dto.data().eventName());

		var grade = this.gradeRepository.findByName(dto.gradeName());

		var data = new EventDetail.EventData();
		data.setEventName(dto.data().eventName());
		data.setEventsInSchoolLife(dto.data().eventsInSchoolLife());
		data.setMyAction(dto.data().myAction());
		data.setMyThought(dto.data().myThought());
		data.setShownPower(dto.data().shownPower());
		data.setStrengthGrown(dto.data().strengthGrown());

	// @formatter:off
    var event = EventDetail.builder()
        .status(EventStatus.UNCONFIRMED)
        .detail(detail.orElse(null))
        .grade(grade.orElse(null))
        .data(data)
        .createdBy(dto.username())
        .updatedBy(dto.username())
        .student(student.orElse(null))
        .build();
    // @formatter:on

		this.entityManager.persist(event);
		this.entityManager.flush();
		var response = new RegisterEventResponseDto(event.getId());
		return response;
	}

	@Override
	public EventDetailDto getStudentEventById(Long id) {
		var qlString = """
				select
				      e
				from
				      com.tuanna.ojt.api.entity.EventDetail e
				left join fetch
				      e.comments
				where
				      e.id = :id
				""";
		var query = this.entityManager.createQuery(qlString, EventDetail.class);
		query.setParameter("id", id);

		var queryResult = query.getResultStream().findFirst().orElse(null);
		if (queryResult != null) {
			var eventDto = queryResult.toDto();
			return eventDto;
		}
		return null;
	}

	@Override
	@Transactional
	public List<CommentDto> addCommentForEventDetailById(AddCommentDto dto) {
		var queryStringBuilder = new StringBuilder();
		queryStringBuilder.append("""
				  select
				    ed
				  from
				    com.tuanna.ojt.api.entity.EventDetail ed
				    left join fetch ed.comments
				  where
				    ed.id = : id
				""");

		var getEventDetailByIdQuery = this.entityManager.createQuery(queryStringBuilder.toString(), EventDetail.class);
		getEventDetailByIdQuery.setParameter("id", dto.eventDetailId());
		var eventDetail = getEventDetailByIdQuery.getResultStream().findFirst().orElse(null);

		if (eventDetail != null) {
			queryStringBuilder.setLength(0);
			queryStringBuilder.append("""
					  select
					    u
					  from
					    com.tuanna.ojt.api.entity.User u
					  where
					    u.username = : username
					""");

			var getUserByUsernameQuery = this.entityManager.createQuery(queryStringBuilder.toString(), User.class);
			getUserByUsernameQuery.setParameter("username", dto.username());

			var user = getUserByUsernameQuery.getResultStream().findFirst().orElse(null);
			if (user != null) {
				var newComment = Comment.builder().user(user).content(dto.content()).isDeleted(false).build();

				eventDetail.getComments().add(newComment);

				this.entityManager.persist(eventDetail);
				this.entityManager.flush();
			}

			queryStringBuilder.setLength(0);
			queryStringBuilder.append("""
					select
					  ed
					from
					  com.tuanna.ojt.api.entity.EventDetail ed
					  left join fetch ed.comments
					where
					  ed.id = : id
					""");
			var getUpdatedCommentList = this.entityManager.createQuery(queryStringBuilder.toString(),
					EventDetail.class);
			getUpdatedCommentList.setParameter("id", dto.eventDetailId());

			var result = getUpdatedCommentList.getResultStream().findFirst().orElse(null);

			if (result != null) {
		// @formatter:off
        var updatedCommentList = result.getComments()
            .stream()
            .sorted(Comparator.comparing(Comment::getCreatedAt))
            .map(Comment::toDto)
            .toList();
        // @formatter:on

				return updatedCommentList;
			}
		}

		return null;

	}

	@Override
	@Transactional
	public void deleteCommentById(DeleteCommentDto dto) {
		var qlString = """
				  update
				    com.tuanna.ojt.api.entity.Comment
				  set
				    isDeleted = true
				  where
				    id = ?1
				    and user.username = ?2
				""";
		var query = this.entityManager.createQuery(qlString);
		query.setParameter(1, dto.id());
		query.setParameter(2, dto.username());
		query.executeUpdate();
		entityManager.flush();
	}

}
