package com.tuanna.ojt.api.constant.converter;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;
import com.tuanna.ojt.api.constant.UserRole;

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
