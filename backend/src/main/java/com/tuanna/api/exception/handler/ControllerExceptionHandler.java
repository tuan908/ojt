package com.tuanna.api.exception.handler;

import java.util.ResourceBundle;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import com.tuanna.api.constant.ErrorCodes;
import com.tuanna.api.constant.ResponseType;
import com.tuanna.api.dto.ApiResponse;
import com.tuanna.api.exception.BusinessException;

@RestControllerAdvice(annotations = RestController.class)
public class ControllerExceptionHandler {

  private final ResourceBundle messagesBundle;

  public ControllerExceptionHandler() {
    super();
    this.messagesBundle = ResourceBundle.getBundle("messages");
  }

  @ExceptionHandler(value = {Exception.class})
  public ResponseEntity<ApiResponse<?>> handleException(Exception ex) {
    return handle(ex, ErrorCodes.INTERNAL_SERVER_ERROR, ResponseType.INTERNAL_SERVER_ERROR);
  }

  @ExceptionHandler(value = {BusinessException.class})
  public ResponseEntity<ApiResponse<?>> handleBusinessException(BusinessException ex) {
    return handle(ex, ErrorCodes.BAD_REQUEST, ResponseType.BAD_REQUEST);
  }

  private ResponseEntity<ApiResponse<?>> handle(Exception ex, ErrorCodes code, ResponseType type) {
    var errorMessage = code.compareTo(ErrorCodes.INTERNAL_SERVER_ERROR) == 0
        ? messagesBundle.getString("error.internalServerError")
        : ex.getMessage();
    return ResponseEntity.ok(ApiResponse.error(code.getValue(), errorMessage, type.getValue()));
  }
}
