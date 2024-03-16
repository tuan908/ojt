package com.tuanna.ojt.api.security;

import java.text.MessageFormat;
import java.util.ResourceBundle;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.tuanna.ojt.api.entity.User;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;

@Service("customUserDetailsService")
public class CustomUserDetailsService implements UserDetailsService {

	private static ResourceBundle messageBundle = ResourceBundle.getBundle("messages");

	@PersistenceContext
	private EntityManager entityManager;

	@Override
	public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
		var query = this.entityManager.createQuery("""
				select
					u
				from
					User
				where
					u.username = :username
				""", User.class);
		query.setParameter("username", username);
		var user = query.getResultStream().findFirst().orElse(null);
		if (user == null) {
			throw new UsernameNotFoundException(
					MessageFormat.format(messageBundle.getString("message.error.not-found"), username));
		}

		return new CustomUserDetails(user);
	}

}
