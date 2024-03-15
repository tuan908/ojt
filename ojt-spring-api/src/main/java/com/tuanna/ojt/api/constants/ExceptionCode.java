package com.tuanna.ojt.api.constants;

public enum ExceptionCode {

    Exception("E0000"), ResultNotFound("E0001"), ;

    private String value;

    ExceptionCode(String code) {
        this.value = code;
    }

    public String getValue() {
        return this.value;
    }

}
