package com.tuanna.api.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.tuanna.api.constant.Constant;
import com.tuanna.api.dto.CreateStudentEventDto;
import com.tuanna.api.dto.UpdateEventStatusDto;
import com.tuanna.api.dto.UpdateStudentEventDto;
import com.tuanna.api.service.StudentEventService;

@RestController
@RequestMapping(path = Constant.API_BASE_PATH + "/student-events")
public class StudentEventController {

  private final StudentEventService studentEventService;

  public StudentEventController(StudentEventService studentEventService) {
    this.studentEventService = studentEventService;
  }

  @GetMapping
  public ResponseEntity<?> findByStudentCodeEventId(@RequestParam String studentCode,
      @RequestParam Long studentEventId) {
    var responseBody = this.studentEventService.findById(studentEventId);
    return ResponseEntity.ok(responseBody);
  }

  @PostMapping
  @ResponseBody
  public ResponseEntity<?> create(@RequestBody CreateStudentEventDto dto) {
    var result = this.studentEventService.create(dto);
    return ResponseEntity.status(HttpStatus.CREATED).body(result);
  }

  @PatchMapping(path = "/{studentEventId}")
  public ResponseEntity<?> updateStatus(@PathVariable Long studentEventId,
      @RequestBody UpdateEventStatusDto dto) {
    var responseBody = this.studentEventService.changeStatus(dto);
    return ResponseEntity.ok().body(responseBody);
  }

  @PutMapping(path = "/{studentEventId}")
  public ResponseEntity<?> update(@PathVariable Long studentEventId,
      @RequestBody UpdateStudentEventDto dto) {
    var responseBody = this.studentEventService.update(dto);
    return ResponseEntity.ok().body(responseBody);
  }

  @DeleteMapping(path = "/{studentEventId}")
  public ResponseEntity<?> delete(@PathVariable Long studentEventId) {
    var responseBody = this.studentEventService.delete(studentEventId);
    return ResponseEntity.ok().body(responseBody);
  }
}
