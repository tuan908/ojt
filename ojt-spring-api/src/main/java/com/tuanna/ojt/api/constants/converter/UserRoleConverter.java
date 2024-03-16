package com.tuanna.ojt.api.constants.converter;

import com.tuanna.ojt.api.constants.UserRole;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter
public class UserRoleConverter implements AttributeConverter<UserRole, String> {

  @Override
  public String convertToDatabaseColumn(UserRole attribute) {
    return attribute.getValue();
  }

  @Override
  public UserRole convertToEntityAttribute(String dbData) {
    return UserRole.fromShortName(dbData);
  }

}
