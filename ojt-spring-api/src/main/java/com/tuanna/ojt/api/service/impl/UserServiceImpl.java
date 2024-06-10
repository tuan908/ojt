package com.tuanna.ojt.api.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.tuanna.ojt.api.dto.LoginDto;
import com.tuanna.ojt.api.dto.LoginResponseDto;
import com.tuanna.ojt.api.dto.UserDto;
import com.tuanna.ojt.api.entity.Student;
import com.tuanna.ojt.api.entity.User;
import com.tuanna.ojt.api.repository.UserRepository;
import com.tuanna.ojt.api.service.UserService;
import lombok.RequiredArgsConstructor;
import jakarta.persistence.EntityManager;

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
		if (user != null && passwordEncoder.matches(loginDto.password(), user.getPassword())) {
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
				// @formatter:off
		        var userDto = new LoginResponseDto(
					  user.getId(),
					  user.getName(),
					  user.getUsername(),
					  user.getRole().getValue(),
					  student.getGrade().getName(),
					  student.getCode()
	        		);
		        // @formatter:on

				return userDto;
			} else {
				// @formatter:off
		        var userDto = new LoginResponseDto(
					  user.getId(),
					  user.getName(),
					  user.getUsername(),
					  user.getRole().getValue(),
					  null,
					  null
	        		);
		        // @formatter:on
		        
				return userDto;
			}
		}

		return null;
	}
}
