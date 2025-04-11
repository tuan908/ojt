package com.tuanna.api.security;

import java.io.IOException;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.tuanna.api.constant.ErrorCodes;
import com.tuanna.api.constant.MessageKey;
import com.tuanna.api.dto.ApiResponse;
import com.tuanna.api.service.MessageService;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class JwtAuthenticationEntryPoint implements AuthenticationEntryPoint {

  private final ObjectMapper objectMapper;

  private final MessageService messageService;

  public JwtAuthenticationEntryPoint(ObjectMapper objectMapper, MessageService messageService) {
    this.objectMapper = objectMapper;
    this.messageService = messageService;
  }

  @Override
  public void commence(HttpServletRequest request, HttpServletResponse response,
      AuthenticationException authException) throws IOException, ServletException {

    response.setStatus(HttpStatus.FORBIDDEN.value());
    response.setContentType(MediaType.APPLICATION_JSON_VALUE);

    var errorResponse = ApiResponse
        .error(ErrorCodes.FORBIDDEN.getValue(),
            messageService.get(MessageKey.ERROR_FORBIDDEN, null), null);

    objectMapper.writeValue(response.getOutputStream(), errorResponse);
  }
}
