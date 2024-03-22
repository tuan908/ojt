package com.tuanna.ojt.api.controller;

import java.text.MessageFormat;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;
import com.tuanna.ojt.api.constants.OjtCode;
import com.tuanna.ojt.api.dto.EventDto;
import com.tuanna.ojt.api.dto.RegisterEventDto;
import com.tuanna.ojt.api.dto.RegisterEventResponseDto;
import com.tuanna.ojt.api.dto.SuccessResponseDto;
import com.tuanna.ojt.api.dto.UpdateEventStatusDto;
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
  
  @PostMapping
  public ResponseEntity<?> register(@RequestBody RegisterEventDto dto) {
    var result = this.eventService.register(dto);
    
    // @formatter:on
    var data = new SuccessResponseDto(
          OjtCode.ACTION_SUCCESS.getValue(),
          "Created",
          "Created event no" + result.id(),
          "/event/" + result.id()
        );
    // @formatter:off
    
    return ResponseEntity.ok().body(data);
  }

  @PostMapping
  public ResponseEntity<?> updateStatus(@RequestBody UpdateEventStatusDto dto) {
    this.eventService.updateStatus(dto);
    
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

}
