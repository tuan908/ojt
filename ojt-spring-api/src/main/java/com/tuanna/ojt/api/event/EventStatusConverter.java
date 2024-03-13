package com.tuanna.ojt.api.event;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

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
