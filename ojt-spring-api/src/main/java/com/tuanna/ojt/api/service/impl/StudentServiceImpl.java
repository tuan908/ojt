package com.tuanna.ojt.api.service.impl;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import java.util.stream.Stream;
import jakarta.persistence.EntityManager;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.web.PagedModel;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import com.tuanna.ojt.api.constant.EventStatus;
import com.tuanna.ojt.api.dto.EventDetailDto;
import com.tuanna.ojt.api.dto.HashtagDto;
import com.tuanna.ojt.api.dto.RegisterEventDto;
import com.tuanna.ojt.api.dto.RegisterEventResponseDto;
import com.tuanna.ojt.api.dto.StudentEventRequestDto;
import com.tuanna.ojt.api.dto.UpdateEventStatusDto;
import com.tuanna.ojt.api.entity.EventDetail;
import com.tuanna.ojt.api.entity.EventDetail.Data;
import com.tuanna.ojt.api.entity.Hashtag;
import com.tuanna.ojt.api.entity.Student;
import com.tuanna.ojt.api.repository.EventDetailRepository;
import com.tuanna.ojt.api.repository.StudentRepository;
import com.tuanna.ojt.api.service.CommonService;
import com.tuanna.ojt.api.service.StudentService;
import lombok.RequiredArgsConstructor;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor(onConstructor_ = {@Autowired})
public class StudentServiceImpl implements StudentService {

	private final @NonNull EntityManager entityManager;

	private final @NonNull StudentRepository studentRepository;

	private final @NonNull EventDetailRepository eventDetailRepository;

	private final @NonNull CommonService commonService;

	@Override
	public PagedModel<?> getEvents(StudentEventRequestDto dto) {
		var parameters = new HashMap<String, Object>();
		var sql = new StringBuilder();
		sql.append("""
				  select
				    s
				  from
				    com.tuanna.ojt.api.entity.Student s
				    left join fetch s.events ev
				    join fetch ev.detail
				    join fetch s.user u
				    join fetch s.grade g
				    left join fetch s.hashtags h
				  where
				    1 = 1
				""");

		if (StringUtils.hasText(dto.name())) {
			sql.append(" and s.name = :studentName");
			parameters.put("studentName", dto.name());
		}

		if (StringUtils.hasText(dto.grade())) {
			sql.append(" and s.grade.name = :grade");
			parameters.put("grade", dto.grade());
		}

		if (StringUtils.hasText(dto.event())) {
			sql.append(" and element(s.events) in :eventName ");
			parameters.put("eventName", dto.event());
		}

		if (dto.hashtags() != null && !dto.hashtags().isEmpty()) {
			sql.append(" and element(s.hashtags).name in :hashtags ");
			parameters.put("hashtags", dto.hashtags());
		}

		sql.append(" order by s.code  ");

		var query = this.entityManager.createQuery(sql.toString(), Student.class);

		for (String key : parameters.keySet()) {
			query.setParameter(key, parameters.get(key));
		}

		query.setFirstResult((dto.pageNumber() - 1) * dto.pageSize());
		query.setMaxResults(dto.pageSize());

		var data = query.getResultList().stream().map(Student::toDto).toList();

		var pageImpl = new PageImpl<>(data);

		var pagedModel = new PagedModel<>(pageImpl);

		return pagedModel;
	}

	@Override
	public HashMap<String, Object> getEventsByStudentCode(String code) {
		var student = this.studentRepository.findByCode(code).orElse(null);

		if (student == null) {
			return null;
		}
		var data = new HashMap<String, Object>();
		data.put("id", student.getId());
		data.put("code", student.getCode());
		data.put("name", student.getUser().getName());
		data.put("grade", student.getGrade().getName());

		List<HashMap<String, Object>> events =
				student.getEvents().stream().filter(event -> !event.getIsDeleted())
						.sorted(Comparator.comparing(EventDetail::getCreatedAt)).map(event -> {
							var hashMap = new HashMap<String, Object>();
							var numberOfComments = event.getComments().stream()
									.filter(comment -> !comment.getIsDeleted()).count();

							hashMap.put("id", event.getId());
							hashMap.put("grade", event.getGrade().getName());
							hashMap.put("name", event.getDetail().getName());
							hashMap.put("status", event.getStatus().getValue());
							hashMap.put("comments", numberOfComments);
							return hashMap;
						}).toList();

		data.put("events", events);

		var hashtags = student.getHashtags().stream().map(Hashtag::toDto)
				.sorted(Comparator.comparing(HashtagDto::name)).toList();

		data.put("hashtags", hashtags);

		return data;
	}

	@Override
	@Transactional
	public Boolean updateEventStatus(UpdateEventStatusDto dto) {
		var qlString = """
				    update
				      com.tuanna.ojt.api.entity.EventDetail
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

		var result = query.executeUpdate();

		return result > 0 ? Boolean.TRUE : Boolean.FALSE;
	}

	@Override
	@Transactional
	public RegisterEventResponseDto registerOrUpdateEvent(RegisterEventDto dto) {
		var student = this.studentRepository.findByUsername(dto.getUsername()).orElse(null);

		var detail = this.commonService.findEventByName(dto.getData().eventName());

		if (student == null || detail == null) {
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
		query.setParameter("gradeName", student.getGrade().getName());
		query.setParameter("eventName", detail.getName());

		var result = query.getResultStream().findFirst();

		EventDetail event = null;
		if (result.isEmpty()) {

			var data = new EventDetail.Data();
			data.setEventName(dto.getData().eventName());
			data.setEventsInSchoolLife(dto.getData().eventsInSchoolLife());
			data.setMyAction(dto.getData().myAction());
			data.setMyThought(dto.getData().myThought());
			data.setShownPower(dto.getData().shownPower());
			data.setStrengthGrown(dto.getData().strengthGrown());

	// @formatter:off
      event = EventDetail.builder()
          .status(EventStatus.UNCONFIRMED)
          .detail(detail)
          .grade(student.getGrade())
          .data(data)
          .createdBy(dto.getUsername())
          .updatedBy(dto.getUsername())
          .student(student)
          .build();
      // @formatter:on
		} else {
			event = result.get();
			var eventData = event.getData();
		// @formatter:off
      eventData = Data.builder()
          .eventName(dto.getData().eventName())
          .eventsInSchoolLife(dto.getData().eventsInSchoolLife())
          .myAction(dto.getData().myAction())
          .myThought(dto.getData().myThought())
          .shownPower(dto.getData().shownPower())
          .strengthGrown(dto.getData().strengthGrown())
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
		var stringBuffer = new StringBuffer();
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
		stringBuffer.append(qlString);

		if (StringUtils.hasText(grade)) {
			stringBuffer.append(" and ed.grade.name = :grade");
			parameters.put("grade", grade);
		}

		if (StringUtils.hasText(eventName)) {
			stringBuffer.append(" and ed.detail.name = :eventName");
			parameters.put("eventName", eventName);
		}

		if (StringUtils.hasText(status)) {
			stringBuffer.append(" and ed.status in :status ");
			var converted = Stream.of(status.split(",")).map(x -> (switch (Integer.valueOf(x)) {
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

		stringBuffer.append(" order by ed.createdAt ");

		var query = this.entityManager.createQuery(stringBuffer.toString(), EventDetail.class);

		for (String key : parameters.keySet()) {
			query.setParameter(key, parameters.get(key));
		}
		query.setParameter("code", code);

		var data = query.getResultStream().map(EventDetail::toDto).toList();
		return data;
	}

}
