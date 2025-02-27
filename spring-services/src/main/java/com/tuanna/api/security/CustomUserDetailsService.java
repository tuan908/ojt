package com.tuanna.api.security;

import java.text.MessageFormat;
import java.util.ResourceBundle;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.tuanna.api.repository.UserRepository;

@Service("customUserDetailsService")
public class CustomUserDetailsService implements UserDetailsService {

	private static ResourceBundle messageBundle = ResourceBundle.getBundle("messages");

	private final UserRepository userRepository;

	public CustomUserDetailsService(UserRepository userRepository) {
		this.userRepository = userRepository;
	}

	@Override
	public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {

		var user = this.userRepository.findByUsername(username).orElse(null);
		if (user == null) {
			throw new UsernameNotFoundException(
					MessageFormat.format(messageBundle.getString("message.error.not-found"), username));
		}

		return new CustomUserDetails(user);
	}

	/**
	 * Find User By ID
	 * @param uid The userID to find
	 * @return UserDetails
	 */
	public UserDetails loadUserById(Long uid) {
		var user = this.userRepository.findById(uid).orElse(null);

		if (user == null) {
			return null;
		}

		return new CustomUserDetails(user);
	}

}
