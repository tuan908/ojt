package com.tuanna.ojt.api.common;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import com.tuanna.ojt.api.common.exception.ResultNotFoundException;

@RestControllerAdvice(annotations = RestController.class)
public class ControllerExceptionHandler {

    @ExceptionHandler(value = {ResultNotFoundException.class})
    public ResponseEntity<?> handle(ResultNotFoundException ex) {
        var responseBody = ErrorResponse.builder().code(ExceptionCode.ResultNotFound.getValue())
                .title("Resource Not Found").message(ex.getMessage()).build();

        return new ResponseEntity<>(responseBody, HttpStatus.NOT_FOUND);
    }

}
