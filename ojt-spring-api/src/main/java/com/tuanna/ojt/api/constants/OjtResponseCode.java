package com.tuanna.ojt.api.constants;

public enum OjtResponseCode {

  INTERNAL_SERVER_ERROR("OJT_0000"), SUCCESS("OJT_0002"), ERROR("OJT_0003");

  private String value;

  OjtResponseCode(String code) {
    this.value = code;
  }

  public String getValue() {
    return this.value;
  }

}