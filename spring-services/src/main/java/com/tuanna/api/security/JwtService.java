package com.tuanna.api.security;

import java.util.Date;
import java.util.Map;

import javax.crypto.SecretKey;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

@Component
public class JwtService {

	private static final Logger log = LoggerFactory.getLogger(JwtService.class);

	private final SecretKey accessTokenKey;
	private final SecretKey refreshTokenKey;
	private final long accessTokenExpiration;
	private final long refreshTokenExpiration;

	public JwtService(
			@Value("${jwt.token.secret}") String accessTokenSecret,
			@Value("${jwt.token.expiration}") long accessTokenExpiration,
			@Value("${jwt.refresh.secret}") String refreshTokenSecret,
			@Value("${jwt.refresh.expiration}") long refreshTokenExpiration) {
		this.accessTokenKey = Keys.hmacShaKeyFor(accessTokenSecret.getBytes());
		this.refreshTokenKey = Keys.hmacShaKeyFor(refreshTokenSecret.getBytes());
		this.accessTokenExpiration = accessTokenExpiration;
		this.refreshTokenExpiration = refreshTokenExpiration;
	}

	public String generateToken(CustomUserDetails userDetails) {
		return generateJwtToken(userDetails, accessTokenKey, accessTokenExpiration);
	}

	public String generateRefreshToken(CustomUserDetails userDetails) {
		return generateJwtToken(userDetails, refreshTokenKey, refreshTokenExpiration);
	}

	private String generateJwtToken(CustomUserDetails userDetails, SecretKey key, long expirationTime) {
		var now = new Date();
		var expiryDate = new Date(now.getTime() + expirationTime);

		var claims = Map.of(
				"name", userDetails.getUser().getName(),
				"role", userDetails.getUser().getRole().getValue());

		return Jwts.builder()
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
		return Jwts.parser()
				.verifyWith(key)
				.build()
				.parseSignedClaims(token)
				.getPayload();
	}
}
