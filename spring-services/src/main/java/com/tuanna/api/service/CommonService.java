package com.tuanna.api.service;

import java.util.List;

import com.tuanna.api.dto.EventDto;
import com.tuanna.api.dto.GradeDto;
import com.tuanna.api.dto.HashtagDto;
import com.tuanna.api.entity.Event;
import com.tuanna.api.entity.Grade;

public interface CommonService {

  List<EventDto> getEvents();

  List<HashtagDto> getHashtags();

  List<GradeDto> getGrades();
  
  Event findEventByName(String name);
  
  Grade findGradeByName(String name);

}
