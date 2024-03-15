package com.tuanna.ojt.api.controller;

import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.tuanna.ojt.api.dto.EventDto;
import com.tuanna.ojt.api.dto.EventRequestDto;
import com.tuanna.ojt.api.service.EventService;
import lombok.RequiredArgsConstructor;


@RestController
@RequestMapping(path = "/api/v1/event")
@RequiredArgsConstructor
public class EventController {

  private final EventService eventService;

  @PostMapping("/all")
  public ResponseEntity<List<EventDto>> getAll(
      final EventRequestDto eventRequestDto) {
    var body = this.eventService.getAll(eventRequestDto);
    return ResponseEntity.ok().body(body);
  }

}
