package com.tuanna.ojt.api.controller;

import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.tuanna.ojt.api.constant.Constant;
import com.tuanna.ojt.api.dto.EventDto;
import com.tuanna.ojt.api.dto.GradeDto;
import com.tuanna.ojt.api.dto.HashtagDto;
import com.tuanna.ojt.api.service.CommonService;
import lombok.RequiredArgsConstructor;


@RestController
@RequestMapping(path = Constant.API_BASE_PATH + "/common")
@RequiredArgsConstructor
public class CommonController {

  private final CommonService commonService;
  
  @GetMapping("/grades")
  public ResponseEntity<List<GradeDto>> getGrades() {
    var body = this.commonService.getGrades();
    return ResponseEntity.ok().body(body);
  }

  @GetMapping("/events")
  public ResponseEntity<List<EventDto>> getEvents() {
    var body = this.commonService.getEvents();
    return ResponseEntity.ok().body(body);
  }
  
  @GetMapping("/hashtags")
  public ResponseEntity<List<HashtagDto>> getHashtags() {
    var data = this.commonService.getHashtags();
    return ResponseEntity.ok(data);
  }

}
