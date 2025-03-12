package com.tuanna.api.exception;

import com.tuanna.api.constant.ResponseCode;

public class BusinessException extends RuntimeException {

  private static final long serialVersionUID = 8635068144605714020L;

  private final String errorCode;

  public BusinessException(String message, String errorCode) {
    super(message);
    this.errorCode = errorCode;
  }
  
  public BusinessException(String message) {
    super(message);
    this.errorCode = ResponseCode.ERROR.getValue();
  }

  public String getErrorCode() {
    return errorCode;
  }

}
