package com.tuanna.ojt.api.account;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter
public class AccountRoleConverter implements AttributeConverter<AccountRole, String> {
  
  @Override
  public String convertToDatabaseColumn(AccountRole attribute) {
      return attribute.getValue();
  }

  @Override
  public AccountRole convertToEntityAttribute(String dbData) {
      return AccountRole.fromShortName(dbData);
  }

}
