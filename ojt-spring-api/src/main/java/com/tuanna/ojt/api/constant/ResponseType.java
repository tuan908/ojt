package com.tuanna.ojt.api.constant;

public enum ResponseType {
  
  ERROR("Error"), INTERNAL_SERVER_ERROR("Internal Server Error"), SUCCESS("Success");
  
  private String value;
  
  ResponseType(String value) {
    this.value = value;
  }
  
  public String getValue() {
    return this.value;
  }
  
  public static ResponseType fromShortName(String dbValue) {
    return switch (dbValue) {
      case "Error":
        yield ResponseType.ERROR;
      
      case "Internal Server Error":
        yield ResponseType.INTERNAL_SERVER_ERROR;
        
      case "Success":
        yield ResponseType.SUCCESS;
        
      default:
        throw new IllegalArgumentException("Unexpected value: " + dbValue);
    };
  }
}
