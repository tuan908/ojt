package com.tuanna.api.exception.handler;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import com.tuanna.api.constant.ResponseCode;
import com.tuanna.api.constant.ResponseType;
import com.tuanna.api.dto.ErrorResponseDto;
import com.tuanna.api.exception.ResultNotFoundException;

@RestControllerAdvice(annotations = RestController.class)
public class ControllerExceptionHandler {

  @ExceptionHandler(value = {ResultNotFoundException.class})
  public ResponseEntity<ErrorResponseDto> handleResultNotFoundException(
      ResultNotFoundException ex) {
    return handleException(ex, ResponseCode.NOT_FOUND, ResponseType.ERROR);
  }

  @ExceptionHandler(value = {Exception.class})
  public ResponseEntity<ErrorResponseDto> handleException(Exception ex) {
    return handleException(ex, ResponseCode.INTERNAL_SERVER_ERROR,
        ResponseType.INTERNAL_SERVER_ERROR);
  }

  private ResponseEntity<ErrorResponseDto> handleException(Exception ex, ResponseCode code,
      ResponseType type) {
    var responseBody = ErrorResponseDto.builder().code(code.getValue()).type(type.getValue())
        .message("Internal Server Error").build();

    return new ResponseEntity<>(responseBody, getHttpStatus(code));
  }

  private HttpStatus getHttpStatus(ResponseCode code) {
    return switch (code) {
      case NOT_FOUND -> HttpStatus.NOT_FOUND;
      case INTERNAL_SERVER_ERROR -> HttpStatus.INTERNAL_SERVER_ERROR;
      default -> HttpStatus.INTERNAL_SERVER_ERROR;
    };
  }
}
