package com.tuanna.api.filter;

import java.io.IOException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import com.tuanna.api.security.CustomUserDetailsService;
import com.tuanna.api.security.JwtService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

public class JwtAuthenticationFilter extends OncePerRequestFilter {

  @Autowired
  private JwtService jwtTokenProvider;

  @Autowired
  private CustomUserDetailsService userService;

  @Override
  protected void doFilterInternal(@NonNull HttpServletRequest request,
      @NonNull HttpServletResponse response, @NonNull FilterChain filterChain)
      throws ServletException, IOException {
    try {
      var jwt = getJwtTokenFromRequest(request);

      if (StringUtils.hasText(jwt) && jwtTokenProvider.validateToken(jwt)) {
        var userId = jwtTokenProvider.getUserIdFromJwt(jwt);
        var userDetails = userService.loadUserById(userId);

        if (userDetails != null) {
          var auth = new UsernamePasswordAuthenticationToken(userDetails, null,
              userDetails.getAuthorities());
          auth.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
          SecurityContextHolder.getContext().setAuthentication(auth);
        }
      }

    } catch (Exception e) {
      // TODO: handle exception
    }
    filterChain.doFilter(request, response);
  }

  private String getJwtTokenFromRequest(HttpServletRequest request) {
    var bearerToken = request.getHeader("Authorization");
    if (!StringUtils.hasLength(bearerToken) || !bearerToken.startsWith("Bearer ")) {
      return null;
    }

    return bearerToken.substring(7);
  }

}
