package com.tuanna.ojt.api.event;

public enum EventStatus {
  
  UNCONFIRMED(1), UNDER_REVIEW(2), COMPLETED(3);

  private Integer value;
  
  EventStatus(Integer i) {
   this.value = i;
  }

  public Integer getValue() {
    return value;
  }

  static EventStatus fromShortName(Integer dbData) {
    return switch (dbData) {
      case 1 -> EventStatus.UNCONFIRMED;
      case 2 -> EventStatus.UNDER_REVIEW;
      case 3 -> EventStatus.COMPLETED;
      default -> throw new IllegalArgumentException("ShortName [" + dbData + "] is not supported");
    };
  }
}
