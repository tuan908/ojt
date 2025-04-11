package com.tuanna.api.service;

import java.util.Locale;

import com.tuanna.api.constant.MessageKey;

public interface MessageService {
  String get(MessageKey key, Object[] args);

  String getWithLocale(Locale locale, MessageKey key, Object[] args);
}
