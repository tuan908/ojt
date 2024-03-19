package com.tuanna.ojt.api.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.tuanna.ojt.api.dto.StudentEventRequestDto;
import com.tuanna.ojt.api.exception.ResultNotFoundException;
import com.tuanna.ojt.api.service.StudentService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/student")
@RequiredArgsConstructor
public class StudentController {

  private final StudentService studentService;

  @PostMapping
  @ResponseBody
  public ResponseEntity<?> getStudentEventList(
      @RequestBody StudentEventRequestDto dto) throws ResultNotFoundException {
    var body = this.studentService.getAll(dto);

    if (body.isEmpty()) {
      throw new ResultNotFoundException();
    }
    return new ResponseEntity<>(body, HttpStatus.OK);

  }

  @GetMapping("/{code}")
  @ResponseBody
  public ResponseEntity<?> getStudentEventDetail(@PathVariable("code") String code) throws ResultNotFoundException {
    var body = this.studentService.getByCode(code);

    if (body == null) {
      throw new ResultNotFoundException();
    }
    return new ResponseEntity<>(body, HttpStatus.OK);

  }

}
