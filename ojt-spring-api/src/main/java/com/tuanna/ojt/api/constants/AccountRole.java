package com.tuanna.ojt.api.constants;

public enum AccountRole {

  STUDENT("001"), PARENT("002"), TEACHER("003"), COUNSELOR("004");

  private String value;

  AccountRole(String s) {
    this.value = s;
  }

  public String getValue() {
    return this.value;
  }

  public static AccountRole fromShortName(String dbData) {
    return switch (dbData) {
      case "001" -> AccountRole.STUDENT;
      case "002" -> AccountRole.PARENT;
      case "003" -> AccountRole.TEACHER;
      case "004" -> AccountRole.COUNSELOR;
      default -> throw new IllegalArgumentException("ShortName [" + dbData + "] is not supported");
    };
  }

}
