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
import com.tuanna.ojt.api.constants.OjtCode;
import com.tuanna.ojt.api.dto.AddCommentDto;
import com.tuanna.ojt.api.dto.RegisterEventDto;
import com.tuanna.ojt.api.dto.StudentEventRequestDto;
import com.tuanna.ojt.api.dto.SuccessResponseDto;
import com.tuanna.ojt.api.dto.UpdateEventStatusDto;
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
  public ResponseEntity<?> getStudentEventList(@RequestBody StudentEventRequestDto dto)
      throws ResultNotFoundException {
    var body = this.studentService.getStudentEventList(dto);

    if (body.isEmpty()) {
      throw new ResultNotFoundException();
    }
    return new ResponseEntity<>(body, HttpStatus.OK);

  }

  @GetMapping("/{code}")
  @ResponseBody
  public ResponseEntity<?> getStudentEventDetail(@PathVariable("code") String code)
      throws ResultNotFoundException {
    var body = this.studentService.getStudentEventListByStudentCode(code);

    if (body == null) {
      throw new ResultNotFoundException();
    }
    return new ResponseEntity<>(body, HttpStatus.OK);

  }

  @PostMapping(path = "/event/register")
  @ResponseBody
  public ResponseEntity<?> register(@RequestBody RegisterEventDto dto) {
    var result = this.studentService.registerEvent(dto);

    // @formatter:off
    var data = new SuccessResponseDto(
          OjtCode.ACTION_SUCCESS.getValue(),
          "Created",
          "Created event no" + result.id(),
          "/event/" + result.id()
        );
    // @formatter:on

    return ResponseEntity.ok().body(data);
  }

  @PostMapping(path = "/event/detail")
  public ResponseEntity<?> updateStatus(@RequestBody UpdateEventStatusDto dto) {
    this.studentService.updateEventStatus(dto);

    // @formatter:off
    var data = new SuccessResponseDto(
        OjtCode.ACTION_SUCCESS.getValue(),
        "Updated", 
        "Updated status for event " + dto.id(), 
        "/student/" + dto.studentId()
      );
    // @formatter:on

    return ResponseEntity.ok().body(data);
  }
  
  @GetMapping(path = "/event/{id}")
  public ResponseEntity<?> getStudentEventDetailById(@PathVariable(value = "id") Long id) {
    var result = this.studentService.getStudentEventById(id);
    return ResponseEntity.ok(result);
  }
  
  @PostMapping("/event/comments")
  public ResponseEntity<?> addCommentForEventDetailById(@RequestBody AddCommentDto dto) {
    final var data = this.studentService.addCommentForEventDetailById(dto);

    return ResponseEntity.ok().body(data);
  }

}
