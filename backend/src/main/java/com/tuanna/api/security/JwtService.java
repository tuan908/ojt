package com.tuanna.api.security;

import java.util.Date;
import java.util.HashMap;

import javax.crypto.SecretKey;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import com.tuanna.api.entity.Student;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import jakarta.persistence.EntityManager;

@Component
public class JwtService {

  private static final Logger log = LoggerFactory.getLogger(JwtService.class);

  private final SecretKey accessTokenKey;
  private final SecretKey refreshTokenKey;
  private final long accessTokenExpiration;
  private final long refreshTokenExpiration;
  private final EntityManager entityManager;

  public JwtService(
      @Value("${jwt.token.secret}") String accessTokenSecret,
      @Value("${jwt.token.expiration}") long accessTokenExpiration,
      @Value("${jwt.refresh.secret}") String refreshTokenSecret,
      @Value("${jwt.refresh.expiration}") long refreshTokenExpiration,
      EntityManager entityManager) {
    this.accessTokenKey = Keys.hmacShaKeyFor(accessTokenSecret.getBytes());
    this.refreshTokenKey = Keys.hmacShaKeyFor(refreshTokenSecret.getBytes());
    this.accessTokenExpiration = accessTokenExpiration;
    this.refreshTokenExpiration = refreshTokenExpiration;
    this.entityManager = entityManager;
  }

  public String generateToken(CustomUserDetails userDetails) {
    return generateJwtToken(userDetails, accessTokenKey, accessTokenExpiration);
  }

  public String generateRefreshToken(CustomUserDetails userDetails) {
    return generateJwtToken(userDetails, refreshTokenKey, refreshTokenExpiration);
  }

  private String generateJwtToken(CustomUserDetails userDetails, SecretKey key,
      long expirationTime) {
    var now = new Date();
    var expiryDate = new Date(now.getTime() + expirationTime);

    var claims = new HashMap<String, String>();
    claims.put("name", userDetails.getUser().getName());
    claims.put("role", userDetails.getUser().getUserRole().getValue());
    claims.put("username", userDetails.getUser().getUsername());

    var sb = new StringBuffer();
    sb.append("select                           ");
    sb.append(" s                               ");
    sb.append("from                             ");
    sb.append(" com.tuanna.api.entity.Student s ");
    sb.append("where                            ");
    sb.append("s.user.username = :username      ");

    var studentQuery = this.entityManager.createQuery(sb.toString(), Student.class);
    studentQuery.setParameter("username", userDetails.getUsername());
    var student = studentQuery.getResultStream().findFirst().orElse(null);

    if (student != null) {
      claims.put("grade", student.getGrade().getName());
      claims.put("code", student.getCode());
    }

    return Jwts
        .builder()
        .subject(userDetails.getUser().getId().toString())
        .claims(claims)
        .issuedAt(now)
        .expiration(expiryDate)
        .signWith(key, Jwts.SIG.HS256)
        .compact();
  }

  public Long getUserIdFromJwt(String token) {
    return Long.parseLong(parseClaims(token, accessTokenKey).getSubject());
  }

  public boolean validateToken(String token) {
    try {
      parseClaims(token, accessTokenKey);
      return true;
    } catch (JwtException | IllegalArgumentException e) {
      log.error("Invalid JWT: {}", e.getMessage());
      return false;
    }
  }

  private Claims parseClaims(String token, SecretKey key) {
    return Jwts.parser().verifyWith(key).build().parseSignedClaims(token).getPayload();
  }
}
