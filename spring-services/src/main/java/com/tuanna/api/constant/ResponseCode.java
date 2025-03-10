package com.tuanna.api.constant;

public enum ResponseCode {

  INTERNAL_SERVER_ERROR("9999"),
  SUCCESS("0000"),
  ERROR("0001"),
  NOT_FOUND("0002");

  private String value;

  ResponseCode(String code) {
    this.value = code;
  }

  public String getValue() {
    return this.value;
  }

}
