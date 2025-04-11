package com.tuanna.api.service.impl;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.tuanna.api.constant.ErrorCodes;
import com.tuanna.api.constant.EventStatus;
import com.tuanna.api.constant.MessageKey;
import com.tuanna.api.dto.ApiResponse;
import com.tuanna.api.dto.CreateDto;
import com.tuanna.api.dto.CreateStudentEventDto;
import com.tuanna.api.dto.StudentEventDto;
import com.tuanna.api.dto.UpdateEventStatusDto;
import com.tuanna.api.dto.UpdateStudentEventDto;
import com.tuanna.api.dto.response.UpdateResponseDto;
import com.tuanna.api.entity.StudentEvent;
import com.tuanna.api.repository.StudentEventRepository;
import com.tuanna.api.repository.StudentRepository;
import com.tuanna.api.service.CommonService;
import com.tuanna.api.service.MessageService;
import com.tuanna.api.service.StudentEventService;

import jakarta.persistence.EntityManager;

@Service
@Transactional
public class StudentEventServiceImpl implements StudentEventService {

  private final EntityManager entityManager;
  private final StudentRepository studentRepository;
  private final StudentEventRepository studentEventRepository;
  private final CommonService commonService;
  private final MessageService messageService;

  public StudentEventServiceImpl(
      EntityManager entityManager,
      StudentRepository studentRepository,
      StudentEventRepository studentEventRepository,
      CommonService commonService,
      MessageService messageService) {
    super();
    this.entityManager = entityManager;
    this.studentRepository = studentRepository;
    this.studentEventRepository = studentEventRepository;
    this.commonService = commonService;
    this.messageService = messageService;
  }

  @Override
  @Transactional
  public ApiResponse<UpdateResponseDto> changeStatus(UpdateEventStatusDto dto) {
    var selectQl = new StringBuffer();
    selectQl.append("select                                   ");
    selectQl.append("  se.id                                  ");
    selectQl.append("from                                     ");
    selectQl.append("  com.tuanna.api.entity.StudentEvent se  ");
    selectQl.append("where                                    ");
    selectQl.append("  id = :id                               ");
    var selectQuery = this.entityManager.createQuery(selectQl.toString(), Long.class);

    selectQuery.setParameter("id", dto.event_id());

    var queryResult = selectQuery.getResultStream().findFirst().orElse(null);

    if (queryResult == null)
      return ApiResponse
          .error(ErrorCodes.NOT_FOUND.getValue(),
              this.messageService.get(MessageKey.ERROR_NOT_FOUND, null), null);

    var sql = new StringBuffer();
    sql.append("update                                  ");
    sql.append("  com.tuanna.api.entity.StudentEvent    ");
    sql.append("set                                     ");
    sql.append("  eventStatus = :status                 ");
    sql.append("where                                   ");
    sql.append("  id = :id                              ");

    var query = this.entityManager.createQuery(sql.toString());
    query.setParameter("id", dto.event_id());
    query.setParameter("status", EventStatus.COMPLETED);

    query.executeUpdate();

    return ApiResponse.success(new UpdateResponseDto(dto.event_id()), null);
  }

  @Override
  @Transactional
  public ApiResponse<CreateDto> create(CreateStudentEventDto dto) {
    var student = this.studentRepository.findByUsername(dto.getUsername()).orElse(null);
    var event = this.commonService.findEventByName(dto.getData().eventName());
    var grade = this.commonService.findGradeByName(dto.getGradeName());

    if (student == null || event == null || grade == null) {
      return null;
    }

    var sql = new StringBuffer();

    sql.append("select                                  ");
    sql.append("  e                                     ");
    sql.append("from                                    ");
    sql.append("  com.tuanna.api.entity.StudentEvent e  ");
    sql.append("where                                   ");
    sql.append("  e.student.code = :code                ");
    sql.append("  and e.grade.name = :gradeName         ");
    sql.append("  and e.event.name = :eventName         ");

    var query = this.entityManager.createQuery(sql.toString(), StudentEvent.class);
    query.setParameter("code", student.getCode());
    query.setParameter("gradeName", student.getGrade().getName());
    query.setParameter("eventName", event.getName());

    var result = query.getResultStream().findFirst().orElse(null);

    if (result != null)
      return ApiResponse.error(ErrorCodes.BAD_REQUEST.getValue(), null, null);

    var studentEvent = new StudentEvent();
    studentEvent.setEvent(event);
    studentEvent.setGrade(grade);
    studentEvent.setStudent(student);

    var eventData = new StudentEvent.Data();
    eventData.setEventName(dto.getData().eventName());
    eventData.setEventsInSchoolLife(dto.getData().eventsInSchoolLife());
    eventData.setMyAction(dto.getData().myAction());
    eventData.setMyThought(dto.getData().myThought());
    eventData.setShownPower(dto.getData().shownPower());
    eventData.setStrengthGrown(dto.getData().strengthGrown());
    studentEvent.setData(eventData);

    this.entityManager.persist(studentEvent);
    this.entityManager.flush();
    var response = new CreateDto(studentEvent.getId());
    return ApiResponse.success(response, null);
  }

  @Override
  public ApiResponse<StudentEventDto> findById(Long id) {
    var studentEvent = this.studentEventRepository.findById(id).orElse(null);
    if (studentEvent == null) {
      return ApiResponse.error(ErrorCodes.NOT_FOUND.getValue(), null, null);
    }
    var studentEventDto = studentEvent.toStudentEventDto();
    return ApiResponse.success(studentEventDto, null);
  }

  @Override
  @Transactional
  public ApiResponse<Object> delete(Long id) {
    var event = this.studentEventRepository.findById(id).orElse(null);

    if (event == null) {
      return ApiResponse.error(null, ErrorCodes.NOT_FOUND.getValue(), null);
    }

    event.softDelete();
    this.studentEventRepository.saveAndFlush(event);
    return ApiResponse.success(null, null);
  }

  @Override
  @Transactional
  public ApiResponse<?> update(UpdateStudentEventDto dto) {
    var student = this.studentRepository.findByUsername(dto.getUsername()).orElse(null);

    var detail = this.commonService.findEventByName(dto.getData().eventName());

    if (student == null || detail == null) {
      return null;
    }

    var sql = new StringBuffer();

    sql.append("select                                  ");
    sql.append("  e                                     ");
    sql.append("from                                    ");
    sql.append("  com.tuanna.api.entity.StudentEvent e  ");
    sql.append("where                                   ");
    sql.append("  e.student.code = :code                ");
    sql.append("  and e.grade.name = :gradeName ");
    sql.append("  and e.event.name = :eventName        ");

    var query = this.entityManager.createQuery(sql.toString(), StudentEvent.class);
    query.setParameter("code", student.getCode());
    query.setParameter("gradeName", dto.getGradeName());
    query.setParameter("eventName", detail.getName());

    var event = query.getResultStream().findFirst().orElse(null);

    if (event == null)
      return ApiResponse
          .error(ErrorCodes.NOT_FOUND.getValue(),
              this.messageService.get(MessageKey.ERROR_NOT_FOUND, null), null);
    var eventData = event.getData();

    eventData.setEventName(dto.getData().eventName());
    eventData.setEventsInSchoolLife(dto.getData().eventsInSchoolLife());
    eventData.setMyAction(dto.getData().myAction());
    eventData.setMyThought(dto.getData().myThought());
    eventData.setShownPower(dto.getData().shownPower());
    eventData.setStrengthGrown(dto.getData().strengthGrown());

    event.setData(eventData);

    this.entityManager.merge(event);
    this.entityManager.flush();
    return ApiResponse.success(new UpdateResponseDto(event.getId()), null);
  }
}
