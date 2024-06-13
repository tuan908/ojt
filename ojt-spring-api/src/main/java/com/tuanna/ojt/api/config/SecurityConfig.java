package com.tuanna.ojt.api.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.CsrfConfigurer;
import org.springframework.security.crypto.argon2.Argon2PasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import com.tuanna.ojt.api.constant.Constant;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

	@Bean
	SecurityFilterChain securityFilterChain(final HttpSecurity http) throws Exception {
		final String pattern = Constant.API_BASE_PATH + "/**";
		http.csrf(CsrfConfigurer::disable).cors(Customizer.withDefaults()).authorizeHttpRequests(
				authorize -> authorize.requestMatchers(pattern).permitAll().anyRequest().authenticated());

		return http.build();
	}

	@Bean
	PasswordEncoder passwordEncoder() {
		var argon2Encoder = new Argon2PasswordEncoder(Constant.ARGON2_SALT_LENGTH, Constant.ARGON2_HASH_LENGTH,
				Constant.ARGON2_PARALLELISM, Constant.ARGON2_MEMORY, Constant.ARGON2_PARALLELISM);
		return argon2Encoder;
	}
}
