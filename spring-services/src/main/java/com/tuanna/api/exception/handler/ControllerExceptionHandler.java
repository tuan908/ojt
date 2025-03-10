package com.tuanna.api.exception.handler;

import java.util.ResourceBundle;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import com.tuanna.api.constant.ResponseCode;
import com.tuanna.api.constant.ResponseType;
import com.tuanna.api.dto.ApiResponse;
import com.tuanna.api.exception.AuthenticationException;
import com.tuanna.api.exception.ResultNotFoundException;

@RestControllerAdvice(annotations = RestController.class)
public class ControllerExceptionHandler {

  private final ResourceBundle rb;

  public ControllerExceptionHandler() {
    super();
    this.rb = ResourceBundle.getBundle("messages");
  }

  @ExceptionHandler(value = {ResultNotFoundException.class})
  public ResponseEntity<ApiResponse<?>> handleResultNotFoundException(ResultNotFoundException ex) {
    return handle(ex, ResponseCode.NOT_FOUND, ResponseType.NOT_FOUND);
  }

  @ExceptionHandler(value = {Exception.class})
  public ResponseEntity<ApiResponse<?>> handleException(Exception ex) {
    return handle(ex, ResponseCode.INTERNAL_SERVER_ERROR, ResponseType.INTERNAL_SERVER_ERROR);
  }

  @ExceptionHandler(value = {AuthenticationException.class})
  public ResponseEntity<ApiResponse<?>> handleGlobalException(Exception ex) {
    return handle(ex, ResponseCode.ERROR, ResponseType.BAD_REQUEST);
  }

  private ResponseEntity<ApiResponse<?>> handle(Exception ex, ResponseCode code,
      ResponseType type) {
    return ResponseEntity
        .ok(ApiResponse
            .error(code.getValue(),
                code.compareTo(ResponseCode.INTERNAL_SERVER_ERROR) == 0
                    ? rb.getString("error.server")
                    : ex.getMessage(),
                type.getValue()));
  }
}
