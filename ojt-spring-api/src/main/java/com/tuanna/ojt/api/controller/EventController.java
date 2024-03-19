package com.tuanna.ojt.api.controller;

import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;
import com.tuanna.ojt.api.dto.EventDto;
import com.tuanna.ojt.api.service.EventDetailService;
import lombok.RequiredArgsConstructor;


@RestController
@RequestMapping(path = "/api/v1/event")
@RequiredArgsConstructor
public class EventController {

  private final EventDetailService eventService;

  @GetMapping
  @ResponseBody
  public ResponseEntity<List<EventDto>> getAll() {
    var body = this.eventService.getAll();
    return ResponseEntity.ok().body(body);
  }

}
