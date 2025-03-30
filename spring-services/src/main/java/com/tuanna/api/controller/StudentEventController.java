package com.tuanna.api.controller;

import java.util.HashMap;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.tuanna.api.constant.Constant;
import com.tuanna.api.dto.AddCommentDto;
import com.tuanna.api.dto.ApiResponse;
import com.tuanna.api.dto.CommentDto;
import com.tuanna.api.dto.CreateDto;
import com.tuanna.api.dto.RegisterEventDto;
import com.tuanna.api.dto.UpdateEventStatusDto;
import com.tuanna.api.service.CommentService;
import com.tuanna.api.service.StudentEventService;

@RestController
@RequestMapping(path = Constant.API_BASE_PATH + "/student-events")
public class StudentEventController {

  private final StudentEventService studentEventService;
  private final CommentService commentService;

  public StudentEventController(
      StudentEventService studentEventService,
      CommentService commentService) {
    this.studentEventService = studentEventService;
    this.commentService = commentService;
  }
  
  @GetMapping
  public ResponseEntity<?> findByStudentCodeEventId(@RequestParam String studentCode,
      @RequestParam Long studentEventId) {
    var result = this.studentEventService.findById(studentEventId);
    return ResponseEntity.ok(result);
  }

  @PostMapping
  @ResponseBody
  public ResponseEntity<?> create(@PathVariable String studentCode,
      @RequestBody RegisterEventDto dto) {
    this.studentEventService.create(dto);
    return ResponseEntity.status(HttpStatus.CREATED).build();
  }

  @PutMapping(path = "/{studentEventId}")
  public ResponseEntity<?> updateStatus(@PathVariable Long studentEventId,
      @RequestBody UpdateEventStatusDto dto) {
    this.studentEventService.changeStatus(dto);
    return ResponseEntity.ok().body(ApiResponse.success(null, null));
  }

  @DeleteMapping(path = "/{eventId}/comments/{commentId}")
  public ResponseEntity<?> deleteComment(@PathVariable Long studentEventId,
      @PathVariable Long commentId) {
    var updatedList = this.commentService.delete(studentEventId, commentId);

    return ResponseEntity.ok().body(updatedList);
  }

  @PostMapping("/{studentEventId}/comments")
  public ResponseEntity<ApiResponse<CreateDto>> addComment(@RequestBody AddCommentDto dto) {
    final var data = this.commentService.create(dto);

    return ResponseEntity.ok().body(data);
  }

  @DeleteMapping("/{studentEventId}/comments/{commentId}")
  public ResponseEntity<ApiResponse<?>> delete(@PathVariable Long studentEventId,
      @PathVariable Long commentId) {
    return ResponseEntity.ok(this.commentService.delete(studentEventId, commentId));
  }

  @PutMapping("/{studentEventId}/comments/{commentId}")
  public ResponseEntity<?> edit(@PathVariable Long studentEventId, @PathVariable Long commentId,
      @RequestBody CommentDto commentDto) {
    var result = this.commentService.update(commentDto);
    var map = new HashMap<String, Object>();
    map.put("data", result);
    return ResponseEntity.ok(map);
  }
}
