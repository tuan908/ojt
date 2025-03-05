package com.tuanna.api.controller;

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

import com.tuanna.api.constant.Constant;
import com.tuanna.api.dto.AddCommentDto;
import com.tuanna.api.dto.ApiResponse;
import com.tuanna.api.dto.CommentDto;
import com.tuanna.api.dto.RegisterEventDto;
import com.tuanna.api.dto.StudentEventRequestDto;
import com.tuanna.api.dto.StudentEventsDto;
import com.tuanna.api.dto.UpdateEventStatusDto;
import com.tuanna.api.exception.ResultNotFoundException;
import com.tuanna.api.service.CommentService;
import com.tuanna.api.service.StudentService;

@RestController
@RequestMapping(path = Constant.API_BASE_PATH + "/students")
public class StudentController {

	private final StudentService studentService;

	public StudentController(StudentService studentService, CommentService commentService) {
		this.studentService = studentService;
		this.commentService = commentService;
	}

	private final CommentService commentService;

	@PostMapping
	@ResponseBody
	public ResponseEntity<?> find(@RequestBody StudentEventRequestDto dto) {
		var data = this.studentService.find(dto);
		return ResponseEntity.ok(data);
	}

	@GetMapping("/{studentCode}")
	@ResponseBody
	public ResponseEntity<?> findByStudentCode(@PathVariable String studentCode,
			@RequestParam(required = false) String grade,
			@RequestParam(value = "event_name", required = false) String eventName,
			@RequestParam(required = false) String status, @RequestParam(required = false, defaultValue = "1") int page,
			@RequestParam(required = false, defaultValue = "10") int size) throws ResultNotFoundException {
		var request = new StudentEventsDto(studentCode, grade, eventName, status, page, size);
		var data = this.studentService.findEventsByStudentCode(request);
		return ResponseEntity.ok(data);
	}

	@PostMapping(path = "/{studentCode}/events")
	@ResponseBody
	public ResponseEntity<?> create(@PathVariable String studentCode, @RequestBody RegisterEventDto dto) {
		this.studentService.update(dto);
		return ResponseEntity.status(HttpStatus.CREATED).build();
	}

	@PostMapping(path = "/{studentCode}/events/{eventId}")
	@ResponseBody
	public ResponseEntity<?> update(@PathVariable String studentCode, @RequestBody RegisterEventDto dto) {
		this.studentService.update(dto);
		return ResponseEntity.status(HttpStatus.CREATED).build();
	}

	@PostMapping(path = "/{studentCode}/events/{eventId}/status")
	public ResponseEntity<?> updateStatus(@PathVariable String studentCode, @PathVariable Long eventId,
			@RequestBody UpdateEventStatusDto dto) {
		this.studentService.updateEventStatus(dto);

		return ResponseEntity.ok().body(ApiResponse.success(null, null));
	}

	@DeleteMapping(path = "/{studentCode}/events/{eventId}")
	public ResponseEntity<?> delete(@PathVariable String studentCode, @PathVariable Long eventId) {
		var updatedList = this.studentService.delete(studentCode, eventId);

		return ResponseEntity.ok().body(updatedList);
	}

	@GetMapping(path = "/{studentCode}/events/{eventId}")
	public ResponseEntity<?> findByStudentCodeEventId(@PathVariable String studentCode, @PathVariable Long eventId) {
		var result = this.studentService.findById(eventId);
		return ResponseEntity.ok(result);
	}

	@PostMapping("/{studentCode}/events/{eventId}/comments")
	public ResponseEntity<?> addComment(@PathVariable String studentCode, @PathVariable Long eventId,
			@RequestBody AddCommentDto dto) {
		final var data = this.commentService.add(dto);

		return ResponseEntity.ok().body(data);
	}

	@DeleteMapping("/{studentCode}/events/{eventId}/comments/{commentId}")
	public ResponseEntity<ApiResponse<?>> deleteComment(@PathVariable String studentCode, @PathVariable Long eventId,
			@PathVariable Long commentId) {
		return ResponseEntity.ok(this.commentService.delete(studentCode, eventId, commentId));
	}

	@PostMapping("/{studentCode}/events/{eventId}/comments/{commentId}")
	public ResponseEntity<?> editComment(@PathVariable String studentCode, @PathVariable Long eventId,
			@PathVariable Long commentId, @RequestBody CommentDto commentDto) {
		var result = this.commentService.update(commentDto);
		var map = new HashMap<String, Object>();
		map.put("data", result);
		return ResponseEntity.ok(map);
	}

}
