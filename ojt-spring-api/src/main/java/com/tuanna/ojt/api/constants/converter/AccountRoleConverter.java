package com.tuanna.ojt.api.constants.converter;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;
import com.tuanna.ojt.api.constants.AccountRole;

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
