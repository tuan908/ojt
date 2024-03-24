package com.tuanna.ojt.api.security;

import java.text.MessageFormat;
import java.util.ResourceBundle;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.tuanna.ojt.api.repository.UserRepository;

@Service("customUserDetailsService")
public class CustomUserDetailsService implements UserDetailsService {

	private static ResourceBundle messageBundle = ResourceBundle.getBundle("messages");

	@Autowired
	private UserRepository userRepository;

	@Override
	public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {

		var user = this.userRepository.findByUsername(username);
		if (user.isEmpty()) {
			throw new UsernameNotFoundException(
					MessageFormat.format(messageBundle.getString("message.error.not-found"), username));
		}

		return new CustomUserDetails(user.get());
	}

}
