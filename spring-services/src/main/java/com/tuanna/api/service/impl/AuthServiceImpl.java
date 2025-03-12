package com.tuanna.api.service.impl;

import java.util.ResourceBundle;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.tuanna.api.dto.ApiResponse;
import com.tuanna.api.dto.LoginDto;
import com.tuanna.api.dto.LoginResponseDto;
import com.tuanna.api.entity.Student;
import com.tuanna.api.exception.BusinessException;
import com.tuanna.api.repository.StudentRepository;
import com.tuanna.api.repository.UserRepository;
import com.tuanna.api.security.CustomUserDetails;
import com.tuanna.api.security.JwtService;
import com.tuanna.api.service.AuthService;

import jakarta.persistence.EntityManager;

@Service
@Transactional(readOnly = true)
public class AuthServiceImpl implements AuthService {

  private final StudentRepository studentRepository;

  private final UserRepository userRepository;

  private final PasswordEncoder passwordEncoder;

  private final EntityManager entityManager;

  private final JwtService jwtService;

  private final ResourceBundle rb;

  public AuthServiceImpl(
      StudentRepository studentRepository,
      UserRepository userRepository,
      PasswordEncoder passwordEncoder,
      EntityManager entityManager,
      JwtService jtp) {
    super();
    this.studentRepository = studentRepository;
    this.userRepository = userRepository;
    this.passwordEncoder = passwordEncoder;
    this.entityManager = entityManager;
    this.jwtService = jtp;
    rb = ResourceBundle.getBundle("messages");
  }

  @Override
  public ApiResponse<LoginResponseDto> login(LoginDto loginDto) throws BusinessException {
    var msg = rb.getString("error.invalid-credentials");

    var user = userRepository.findByUsername(loginDto.username()).orElse(null);

    if (user == null || !passwordEncoder.matches(loginDto.password(), user.getPassword())) {
      throw new BusinessException(msg);
    }

    // Fetch student details if available
    String qlString = "select s from com.tuanna.api.entity.Student s where s.user.id = :id";
    var q = this.entityManager.createQuery(qlString, Student.class);
    q.setParameter("id", user.getId());

    Student student = q.getResultStream().findFirst().orElse(null);

    // Generate JWT token
    String token = jwtService.generateToken(new CustomUserDetails(user));

    return ApiResponse
        .success(new LoginResponseDto(
            user.getId(),
            user.getName(),
            user.getUsername(),
            user.getRole().getValue(),
            (student != null) ? student.getGrade().getName() : null,
            (student != null) ? student.getCode() : null,
            token), null);
  }

  @Override
  public void logout() {
    // TODO Auto-generated method stub

  }

  @Override
  public void refreshToken() {
    // TODO Auto-generated method stub

  }

  @Override
  public void validateToken() {
    // TODO Auto-generated method stub

  }

  @Override
  public void resetPassword() {
    // TODO Auto-generated method stub

  }

  @Override
  public void changePassword() {
    // TODO Auto-generated method stub

  }

}
