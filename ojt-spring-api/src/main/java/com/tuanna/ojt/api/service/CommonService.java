package com.tuanna.ojt.api.service;

import java.util.List;
import com.tuanna.ojt.api.dto.EventDto;
import com.tuanna.ojt.api.dto.GradeDto;
import com.tuanna.ojt.api.dto.HashtagDto;
import com.tuanna.ojt.api.entity.Event;
import com.tuanna.ojt.api.entity.Grade;

public interface CommonService {

  List<EventDto> getEvents();

  List<HashtagDto> getHashtags();

  List<GradeDto> getGrades();
  
  Event findEventByName(String name);
  
  Grade findGradeByName(String name);

}
