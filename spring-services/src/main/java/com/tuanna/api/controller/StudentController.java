package com.tuanna.api.controller;

import java.util.Collections;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;
import com.tuanna.api.constant.Constant;
import com.tuanna.api.dto.StudentEventRequestDto;
import com.tuanna.api.dto.StudentEventsDto;
import com.tuanna.api.service.StudentService;
import io.jsonwebtoken.lang.Arrays;

@RestController
@RequestMapping(path = Constant.API_BASE_PATH + "/students")
public class StudentController {

  private final StudentService studentService;

  public StudentController(StudentService studentService) {
    this.studentService = studentService;
  }

  @GetMapping
  public ResponseEntity<?> getAll(@RequestParam(required = false) String name,
      @RequestParam(required = false) String grade, @RequestParam(required = false) String event,
      @RequestParam(required = false) String hashtags,
      @RequestParam(required = false, defaultValue = "1") int page,
      @RequestParam(required = false, defaultValue = "10") int limit) {

    List<String> _hashtags = !StringUtils.hasText(hashtags) ? Collections.emptyList()
        : Arrays.asList(hashtags.split(","));
    var request = new StudentEventRequestDto(name, grade, event, _hashtags, page, limit);
    var data = this.studentService.findAll(request);
    return ResponseEntity.ok(data);
  }

  @GetMapping("/{studentCode}")
  @ResponseBody
  public ResponseEntity<?> findByStudentCode(@PathVariable String studentCode,
      @RequestParam(required = false) String grade,
      @RequestParam(value = "event_name", required = false) String eventName,
      @RequestParam(required = false) String status,
      @RequestParam(required = false, defaultValue = "1") int page,
      @RequestParam(required = false, defaultValue = "10") int size) {
    var request = new StudentEventsDto(studentCode, grade, eventName, status, page, size);
    var data = this.studentService.findByStudentCode(request);
    return ResponseEntity.ok(data);
  }

}
