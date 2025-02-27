package com.tuanna.api.security;

import java.util.Date;
import java.util.HashMap;

import javax.crypto.SecretKey;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.UnsupportedJwtException;
import io.jsonwebtoken.security.Keys;
import lombok.var;

@Component
public class JwtTokenProvider {
	
	private static final Logger log = LoggerFactory.getLogger(JwtTokenProvider.class);

	@Value("jwt.token.secret")
	private String ACCESS_TOKEN_SECRET;

	@Value("jwt.secret.expired-time")
	private Long ACCESS_TOKEN_EXPIRATION;

	@Value("jwt.token.secret")
	private String REFRESH_TOKEN_SECRET;

	@Value("jwt.secret.expired-time")
	private Long REFRESH_TOKEN_EXPIRATION;

	public String generateToken(CustomUserDetails userDetails) {
		var now = new Date();
		var expiryDate = new Date(now.getTime() + this.ACCESS_TOKEN_EXPIRATION);

		var claim = new HashMap<String, Object>();
		claim.put("s1", userDetails.getUser().getName());
		claim.put("s2", userDetails.getUser().getRole().getValue());

		return Jwts.builder().subject(userDetails.getUser().getId().toString()).claims(claim).issuedAt(now)
				.expiration(expiryDate).signWith(getKey()).compact();
	}

	public Long getUserIdFromJwt(String token) {
		var claims = Jwts.parser().decryptWith(getKey()).build().parseSignedClaims(token).getPayload();

		return Long.parseLong(claims.getSubject());
	}

	private SecretKey getKey() {
		if (ACCESS_TOKEN_SECRET == null) {
			return null;
		}

		return Keys.hmacShaKeyFor(ACCESS_TOKEN_SECRET.getBytes());
	}
	
    public boolean validateToken(String authToken) {
        try {
            Jwts.parser().decryptWith(getKey()).build().parseSignedClaims(authToken);
            return true;
        } catch (MalformedJwtException ex) {
            log.error("Invalid JWT token");
        } catch (ExpiredJwtException ex) {
            log.error("Expired JWT token");
        } catch (UnsupportedJwtException ex) {
            log.error("Unsupported JWT token");
        } catch (IllegalArgumentException ex) {
            log.error("JWT claims string is empty.");
        }
        return false;
    }
}
