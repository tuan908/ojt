package com.tuanna.ojt.api.constant.converter;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;
import com.tuanna.ojt.api.constant.EventStatus;

@Converter
public class EventStatusConverter implements AttributeConverter<EventStatus, Integer> {
  
  @Override
  public Integer convertToDatabaseColumn(EventStatus attribute) {
      return attribute.getValue();
  }

  @Override
  public EventStatus convertToEntityAttribute(Integer dbData) {
      return EventStatus.fromShortName(dbData);
  }

}
