package com.tuanna.ojt.api.constants;

public enum Status {
  
  Unconfirmed(1), UnderReview(2), Completed(3);
  
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
        yield Status.Unconfirmed;
      
      case 2:
        yield Status.UnderReview;
        
      case 3:
        yield Status.Completed;
        
      default:
        throw new IllegalArgumentException("Unexpected value: " + dbValue);
    };
  }
}
