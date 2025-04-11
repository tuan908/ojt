package com.tuanna.api.security;

import java.text.MessageFormat;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.tuanna.api.constant.MessageKey;
import com.tuanna.api.repository.UserRepository;
import com.tuanna.api.service.MessageService;

@Service("customUserDetailsService")
public class CustomUserDetailsService implements UserDetailsService {

  private final UserRepository userRepository;
  private final MessageService messageService;

  public CustomUserDetailsService(UserRepository userRepository, MessageService messageService) {
    this.userRepository = userRepository;
    this.messageService = messageService;
  }

  @Override
  public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {

    var user = this.userRepository.findByUsername(username).orElse(null);
    if (user == null) {
      throw new UsernameNotFoundException(
          MessageFormat.format(messageService.get(MessageKey.ERROR_NOT_FOUND, null), username));
    }

    return new CustomUserDetails(user);
  }

  /**
   * Find User By ID
   *
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
