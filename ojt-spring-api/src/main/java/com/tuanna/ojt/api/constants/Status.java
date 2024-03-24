package com.tuanna.ojt.api.constants;

public enum Status {
  
  UNCONFIRMED(1), UNDER_REVIEWING(2), COMPLETED(3);
  
  private Integer value;
  
  Status(Integer value) {
    this.value = value;
  }
  
  public Integer getValue() {
    return this.value;
  }
  
  public static Status fromShortName(Integer dbValue) {
    return switch (dbValue) {
      case 1:
        yield Status.UNCONFIRMED;
      
      case 2:
        yield Status.UNDER_REVIEWING;
        
      case 3:
        yield Status.COMPLETED;
        
      default:
        throw new IllegalArgumentException("Unexpected value: " + dbValue);
    };
  }
}
