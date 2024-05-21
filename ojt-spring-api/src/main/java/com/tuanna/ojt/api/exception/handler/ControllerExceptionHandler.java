package com.tuanna.ojt.api.exception.handler;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import com.tuanna.ojt.api.constants.OjtResponseCode;
import com.tuanna.ojt.api.constants.OjtResponseType;
import com.tuanna.ojt.api.dto.ErrorResponseDto;
import com.tuanna.ojt.api.exception.ResultNotFoundException;

@RestControllerAdvice(annotations = RestController.class)
public class ControllerExceptionHandler {

  @ExceptionHandler(value = {ResultNotFoundException.class})
  public ResponseEntity<?> handle(ResultNotFoundException ex) {
    var responseBody = ErrorResponseDto.builder().code(OjtResponseCode.INTERNAL_SERVER_ERROR.getValue())
        .type(OjtResponseType.ERROR.getValue()).message(ex.getMessage()).build();

    return new ResponseEntity<>(responseBody, HttpStatus.NOT_FOUND);
  }
  
  @ExceptionHandler(value = {Exception.class})
  public ResponseEntity<?> handle(Exception ex) {
    var responseBody = ErrorResponseDto.builder().code(OjtResponseCode.INTERNAL_SERVER_ERROR.getValue())
        .type(OjtResponseType.INTERNAL_SERVER_ERROR.getValue()).message(ex.getMessage()).build();

    return new ResponseEntity<>(responseBody, HttpStatus.INTERNAL_SERVER_ERROR);
  }

}
