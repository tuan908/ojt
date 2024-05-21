package com.tuanna.ojt.api.constants;

public enum OjtResponseType {
  
  ERROR("Error"), INTERNAL_SERVER_ERROR("Internal Server Error"), SUCCESS("Success");
  
  private String value;
  
  OjtResponseType(String value) {
    this.value = value;
  }
  
  public String getValue() {
    return this.value;
  }
  
  public static OjtResponseType fromShortName(String dbValue) {
    return switch (dbValue) {
      case "Error":
        yield OjtResponseType.ERROR;
      
      case "Internal Server Error":
        yield OjtResponseType.INTERNAL_SERVER_ERROR;
        
      case "Success":
        yield OjtResponseType.SUCCESS;
        
      default:
        throw new IllegalArgumentException("Unexpected value: " + dbValue);
    };
  }
}
