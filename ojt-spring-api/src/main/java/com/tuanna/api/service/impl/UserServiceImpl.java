package com.tuanna.api.service.impl;

import java.util.concurrent.CompletableFuture;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Async;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.tuanna.api.dto.LoginDto;
import com.tuanna.api.dto.LoginResponseDto;
import com.tuanna.api.dto.UserDto;
import com.tuanna.api.entity.Student;
import com.tuanna.api.entity.User;
import com.tuanna.api.repository.UserRepository;
import com.tuanna.api.service.UserService;

import jakarta.persistence.EntityManager;
import lombok.RequiredArgsConstructor;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor(onConstructor_ = {@Autowired})
public class UserServiceImpl implements UserService {

	private final UserRepository userRepository;

	private final PasswordEncoder passwordEncoder;

	private final EntityManager entityManager;

	@Override
	public UserDto findByUsername(UserDto request) {
		var queryResult = this.userRepository.findByUsername(request.username());
		return queryResult.map(User::toDto).orElse(null);
	}

	@Override
	public LoginResponseDto login(LoginDto loginDto) {
		var sb = new StringBuilder();
		var user = this.userRepository.findByUsername(loginDto.username()).orElse(null);

		if (user == null || !passwordEncoder.matches(loginDto.password(), user.getPassword())) {
			return null;
		}

		sb.setLength(0);

		sb.append("""
				    select
				      s
				    from
				      com.tuanna.ojt.api.entity.Student s
				    where
				      s.user.id = :id
				""");

		var query = this.entityManager.createQuery(sb.toString(), Student.class);
		query.setParameter("id", user.getId());
		var student = query.getResultStream().findFirst().orElse(null);

		if (student != null) {
			var userDto = new LoginResponseDto(user.getId(), user.getName(), user.getUsername(),
					user.getRole().getValue(), student.getGrade().getName(), student.getCode());
			return userDto;
		} else {
			var userDto = new LoginResponseDto(user.getId(), user.getName(), user.getUsername(),
					user.getRole().getValue(), null, null);
			return userDto;
		}
	}

	@Override
	@Async
	public CompletableFuture<?> findByUsernameAsync(String username) {
		var query = entityManager.createQuery("""
				select
					s
				from
					com.tuanna.ojt.api.entity.Student s
				join fetch s.user
				where
					s.code = :username
				""", Student.class);
			
			query.setParameter("username", username);
		
		var queryResult = query.getResultStream().findFirst();	
		if (queryResult.isEmpty()) {
			return CompletableFuture.completedFuture(null);
		}
		return CompletableFuture.completedFuture(queryResult.get().toDto());
	}

	@Override
	@Async
	public CompletableFuture<?> findAllAsync() {
		var query = this.entityManager.createQuery("""
				select
					s
				from
					com.tuanna.ojt.api.entity.Student s
				join fetch s.user
				""", Student.class).getResultStream().map(s -> s.toDto());
		return CompletableFuture.completedFuture(query);
	}
}
