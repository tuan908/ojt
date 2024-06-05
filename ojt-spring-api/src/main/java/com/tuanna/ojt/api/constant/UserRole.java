package com.tuanna.ojt.api.constant;

public enum UserRole {

  UNKNOWN("000"), STUDENT("001"), PARENT("002"), TEACHER("003"), COUNSELOR("004");

  private String value;

  UserRole(String s) {
    this.value = s;
  }

  public String getValue() {
    return this.value;
  }

  public static UserRole fromShortName(String dbData) {
    return switch (dbData) {
      case "001" -> UserRole.STUDENT;
      case "002" -> UserRole.PARENT;
      case "003" -> UserRole.TEACHER;
      case "004" -> UserRole.COUNSELOR;
      default -> throw new IllegalArgumentException("ShortName [" + dbData + "] is not supported");
    };
  }

}
