package com.tuanna.api.constant.converter;

import com.tuanna.api.constant.UserRole;

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
