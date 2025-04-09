package com.tuanna.api.service.impl;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.tuanna.api.constant.EventStatus;
import com.tuanna.api.constant.ErrorCodes;
import com.tuanna.api.dto.ApiResponse;
import com.tuanna.api.dto.CreateDto;
import com.tuanna.api.dto.StudentEventDto;
import com.tuanna.api.dto.CreateStudentEventDto;
import com.tuanna.api.dto.UpdateEventStatusDto;
import com.tuanna.api.dto.UpdateStudentEventDto;
import com.tuanna.api.entity.Grade;
import com.tuanna.api.entity.StudentEvent;
import com.tuanna.api.repository.StudentEventRepository;
import com.tuanna.api.repository.StudentRepository;
import com.tuanna.api.service.CommonService;
import com.tuanna.api.service.StudentEventService;
import jakarta.persistence.EntityManager;

@Service
@Transactional
public class StudentEventServiceImpl implements StudentEventService {

  private final EntityManager entityManager;
  private final StudentRepository studentRepository;
  private final CommonService commonService;
  private final StudentEventRepository studentEventRepository;

  public StudentEventServiceImpl(EntityManager entityManager, StudentRepository studentRepository,
      CommonService commonService, StudentEventRepository studentEventRepository) {
    super();
    this.entityManager = entityManager;
    this.studentRepository = studentRepository;
    this.commonService = commonService;
    this.studentEventRepository = studentEventRepository;
  }

  @Override
  @Transactional
  public ApiResponse<Boolean> changeStatus(UpdateEventStatusDto dto) {
    var sql = new StringBuffer();
    sql.append("update                              ");
    sql.append("  com.tuanna.api.entity.StudentEvent ");
    sql.append("set                                 ");
    sql.append("  status = :status,                 ");
    sql.append("  updatedBy = :updatedBy            ");
    sql.append("where                               ");
    sql.append("  id = :id                          ");

    var query = this.entityManager.createQuery(sql.toString());
    query.setParameter("id", dto.event_id());
    query.setParameter("status", EventStatus.COMPLETED);
    query.setParameter("updatedBy", dto.updated_by());

    int result = query.executeUpdate();

    return ApiResponse.success(result > 0, null);
  }

  @Override
  @Transactional
  public ApiResponse<CreateDto> create(CreateStudentEventDto dto) {
    var student = this.studentRepository.findByUsername(dto.getUsername()).orElse(null);

    var event = this.commonService.findEventByName(dto.getData().eventName());

    var gradeQlString = "select g from com.tuanna.api.entity.Grade g where g.name = :gradeName";

    var gradeQuery = this.entityManager.createQuery(gradeQlString, Grade.class);
    gradeQuery.setParameter("gradeName", dto.getGradeName());
    var grade = gradeQuery.getResultStream().findFirst().orElse(null);

    if (student == null || event == null || grade == null) {
      return null;
    }

    var sql = new StringBuffer();

    sql.append("select                                  ");
    sql.append("  e                                     ");
    sql.append("from                                    ");
    sql.append("  com.tuanna.api.entity.StudentEvent e   ");
    sql.append("where                                   ");
    sql.append("  e.student.code = :code                ");
    sql.append("  and e.student.grade.name = :gradeName ");
    sql.append("  and e.event.name = :eventName        ");
    sql.append("  and e.isDeleted = false               ");

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
  public ApiResponse<Object> update(UpdateStudentEventDto dto) {
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
    sql.append("  and e.student.grade.name = :gradeName ");
    sql.append("  and e.event.name = :eventName        ");

    var query = this.entityManager.createQuery(sql.toString(), StudentEvent.class);
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

    this.entityManager.merge(event);
    this.entityManager.flush();
    return ApiResponse.success(null, null);
  }
}
