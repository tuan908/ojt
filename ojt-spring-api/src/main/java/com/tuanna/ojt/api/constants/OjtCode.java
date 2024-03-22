package com.tuanna.ojt.api.constants;

public enum OjtCode {

  EXCEPTION("OJT_0000"), ACTION_SUCCESS("OJT_0002"), ACTION_FAILED("OJT_0003");

  private String value;

  OjtCode(String code) {
    this.value = code;
  }

  public String getValue() {
    return this.value;
  }

}
