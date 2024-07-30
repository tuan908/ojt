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
import com.tuanna.ojt.api.constant.Constant;
import com.tuanna.ojt.api.constant.ResponseCode;
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
@RequestMapping(path = Constant.API_BASE_PATH + "/students")
@RequiredArgsConstructor
public class StudentController {

	private final StudentService studentService;

	private final CommentService commentService;

	@PostMapping
	@ResponseBody
	public ResponseEntity<?> getStudentEvents(@RequestBody StudentEventRequestDto dto) {
		var data = this.studentService.getEvents(dto);
		return ResponseEntity.ok(data);
	}

	@GetMapping("/{studentCode}")
	@ResponseBody
	public ResponseEntity<?> getStudentEventDetailWithCondition(@PathVariable String studentCode,
			@RequestParam(required = false) String grade,
			@RequestParam(value = "event_name", required = false) String eventName,
			@RequestParam(required = false) String status) throws ResultNotFoundException {
		var data = this.studentService.getEventsByStudentCode(studentCode, grade, eventName, status);
		return ResponseEntity.ok(data);
	}

	@PostMapping(path = "/{studentCode}/events")
	@ResponseBody
	public ResponseEntity<?> register(@PathVariable String studentCode, @RequestBody RegisterEventDto dto) {
		this.studentService.registerOrUpdateEvent(dto);
		return ResponseEntity.status(HttpStatus.CREATED).build();
	}

	@PostMapping(path = "/{studentCode}/events/{eventId}")
	public ResponseEntity<?> updateStatus(@PathVariable String studentCode, @PathVariable Long eventId,
			@RequestBody UpdateEventStatusDto dto) {
		this.studentService.updateEventStatus(dto);

	// @formatter:off
    var data = new SuccessResponseDto(
        ResponseCode.SUCCESS.getValue(),
        "Updated", 
        "Updated status for event " + dto.id(), 
        "/student/" + dto.studentId()
      );
    // @formatter:on

		return ResponseEntity.ok().body(data);
	}

	@DeleteMapping(path = "/{studentCode}/events/{eventId}")
	public ResponseEntity<?> deleteEventDetailById(@PathVariable String studentCode, @PathVariable Long eventId) {
		var updatedList = this.studentService.deleteEventById(studentCode, eventId);

		return ResponseEntity.ok().body(updatedList);
	}

	@GetMapping(path = "/{studentCode}/events/{eventId}")
	public ResponseEntity<?> getStudentEventDetailById(@PathVariable String studentCode, @PathVariable Long eventId) {
		var result = this.studentService.getStudentEventById(eventId);
		return ResponseEntity.ok(result);
	}

	@PostMapping("/{studentCode}/events/{eventId}/comments")
	public ResponseEntity<?> addCommentForEventDetailById(@PathVariable String studentCode, @PathVariable Long eventId, @RequestBody AddCommentDto dto) {
		final var data = this.commentService.add(dto);

		return ResponseEntity.ok().body(data);
	}

	@DeleteMapping("/{studentCode}/events/{eventId}/comments/{commentId}")
	public ResponseEntity<?> deleteCommentById(@PathVariable String studentCode, @PathVariable Long eventId,
			@PathVariable Long commentId) {
		this.commentService.delete(commentId);

	// @formatter:off
    var data = new SuccessResponseDto(
        ResponseCode.SUCCESS.getValue(),
        "Deleted", 
        "Deleted comment " + commentId, 
        "/student/comments/" + commentId
      );
    // @formatter:on

		return ResponseEntity.ok().body(data);
	}

	@PostMapping("/{studentCode}/events/{eventId}/comments/{commentId}")
	public ResponseEntity<?> editComment(
			@PathVariable String studentCode,
			@PathVariable Long eventId,
			@PathVariable Long commentId,
			@RequestBody CommentDto commentDto) {
		var result = this.commentService.update(commentDto);
		var map = new HashMap<String, Object>();
		map.put("data", result);
		return ResponseEntity.ok(map);
	}

}
