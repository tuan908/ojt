package com.tuanna.api.service.impl;

import java.util.Locale;

import org.springframework.context.MessageSource;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.stereotype.Service;

import com.tuanna.api.constant.MessageKey;
import com.tuanna.api.service.MessageService;

@Service
public class MessageServiceImpl implements MessageService {

  private final MessageSource messageSource;

  public MessageServiceImpl(MessageSource messageSource) {
    this.messageSource = messageSource;
  }

  @Override
  public String get(MessageKey key, Object[] args) {
    Locale locale = LocaleContextHolder.getLocale();
    return messageSource.getMessage(key.key(), args, locale);
  }

  @Override
  public String getWithLocale(Locale locale, MessageKey key, Object[] args) {
    return messageSource.getMessage(key.key(), args, locale);
  }

}
