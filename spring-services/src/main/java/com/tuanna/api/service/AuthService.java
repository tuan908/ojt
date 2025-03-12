package com.tuanna.api.service;

import com.tuanna.api.dto.ApiResponse;
import com.tuanna.api.dto.LoginDto;
import com.tuanna.api.dto.LoginResponseDto;
import com.tuanna.api.exception.BusinessException;

public interface AuthService {
  ApiResponse<LoginResponseDto> login(LoginDto loginDto) throws BusinessException;

  void logout();

  void refreshToken();

  void validateToken();

  void resetPassword();

  void changePassword();
}
