package com.tuanna.api.exception;

import java.io.Serial;

public class ResultNotFoundException extends Exception {

    @Serial
    private static final long serialVersionUID = 8667285110473345030L;

    public ResultNotFoundException(String s) {
        super(s);
    }

    public ResultNotFoundException() {
      // TODO Auto-generated constructor stub
    }
}
