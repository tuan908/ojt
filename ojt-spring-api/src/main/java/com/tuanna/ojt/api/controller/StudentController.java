package com.tuanna.ojt.api.controller;

import java.util.HashMap;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.tuanna.ojt.api.constants.OjtResponseCode;
import com.tuanna.ojt.api.dto.AddCommentDto;
import com.tuanna.ojt.api.dto.CommentDto;
import com.tuanna.ojt.api.dto.RegisterEventDto;
import com.tuanna.ojt.api.dto.StudentEventRequestDto;
import com.tuanna.ojt.api.dto.SuccessResponseDto;
import com.tuanna.ojt.api.dto.UpdateEventStatusDto;
import com.tuanna.ojt.api.exception.ResultNotFoundException;
import com.tuanna.ojt.api.service.CommentService;
import com.tuanna.ojt.api.service.StudentService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/student")
@RequiredArgsConstructor
public class StudentController {

  private final StudentService studentService;

  private final CommentService commentService;

  @PostMapping
  @ResponseBody
  public ResponseEntity<?> getStudentEventList(@RequestBody StudentEventRequestDto dto) {
    var data = this.studentService.getEventList(dto);
    return ResponseEntity.ok(data);
  }

  @GetMapping("/{code}")
  @ResponseBody
  public ResponseEntity<?> getStudentEventDetail(@PathVariable("code") String code)
      throws ResultNotFoundException {
    var data = this.studentService.getEventsByStudentCode(code);
    return ResponseEntity.ok(data);
  }


  @GetMapping("/{code}/q")
  @ResponseBody
  public ResponseEntity<?> getStudentEventDetailWithCondition(@PathVariable("code") String code,
      @RequestParam(value = "grade", required = false) String grade,
      @RequestParam(value = "event_name", required = false) String eventName,
      @RequestParam(value = "status", required = false) String status)
      throws ResultNotFoundException {
    var body = this.studentService.getEventsByStudentCode(code, grade, eventName, status);

    if (body == null) {
      throw new ResultNotFoundException();
    }
    return new ResponseEntity<>(body, HttpStatus.OK);

  }


  @PostMapping(path = "/event/register")
  @ResponseBody
  public ResponseEntity<?> register(@RequestBody RegisterEventDto dto) {
    var result = this.studentService.registerOrUpdateEvent(dto);

    // @formatter:off
    var data = new SuccessResponseDto(
          OjtResponseCode.SUCCESS.getValue(),
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
        OjtResponseCode.SUCCESS.getValue(),
        "Updated", 
        "Updated status for event " + dto.id(), 
        "/student/" + dto.studentId()
      );
    // @formatter:on

    return ResponseEntity.ok().body(data);
  }

  @DeleteMapping(path = "/{code}/event/{id}")
  public ResponseEntity<?> deleteEventDetailById(@PathVariable(value = "code") String code,
      @PathVariable(value = "id") Long id) {
    var updatedList = this.studentService.deleteEventById(code, id);

    return ResponseEntity.ok().body(updatedList);
  }

  @GetMapping(path = "/event/{id}")
  public ResponseEntity<?> getStudentEventDetailById(@PathVariable(value = "id") Long id) {
    var result = this.studentService.getStudentEventById(id);
    return ResponseEntity.ok(result);
  }

  @PostMapping("/event/comments")
  public ResponseEntity<?> addCommentForEventDetailById(@RequestBody AddCommentDto dto) {
    final var data = this.commentService.add(dto);

    return ResponseEntity.ok().body(data);
  }

  @DeleteMapping("/event/comments/{id}")
  public ResponseEntity<?> deleteCommentById(@PathVariable("id") Long id) {
    this.commentService.delete(id);

    // @formatter:off
    var data = new SuccessResponseDto(
        OjtResponseCode.SUCCESS.getValue(),
        "Deleted", 
        "Deleted comment " + id, 
        "/student/comments/" + id
      );
    // @formatter:on

    return ResponseEntity.ok().body(data);
  }
  
  @PostMapping("/event/comments/p")
  public ResponseEntity<?> editComment(@RequestBody CommentDto commentDto) {
	  var result = this.commentService.update(commentDto);
	  var map = new HashMap<String, Object>();
	  map.put("data", result);
	  return ResponseEntity.ok(map);
	  
  }

}
