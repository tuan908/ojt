package com.tuanna.api.exception;

public class AuthenticationException extends Exception {
  private static final long serialVersionUID = -8185105419715872084L;

  public AuthenticationException(String message) {
    super(message);
  }

}
