package com.tuanna.ojt.api.service.impl;

import org.springframework.data.jpa.repository.JpaContext;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.tuanna.ojt.api.dto.AccountDto;
import com.tuanna.ojt.api.entity.Account;
import com.tuanna.ojt.api.repository.AccountRepository;
import com.tuanna.ojt.api.service.AccountService;
import jakarta.persistence.EntityManager;

@Service
@Transactional(readOnly = true)
public class AccountServiceImpl implements AccountService {

  private final EntityManager em;

  private AccountRepository accountRepository;

  public AccountServiceImpl(JpaContext jpaContext, AccountRepository ac) {
    this.accountRepository = ac;
    this.em = jpaContext.getEntityManagerByManagedType(Account.class);
  }

  @Override
  public AccountDto getOneBy(AccountDto request) {
    var queryResult = this.accountRepository.findByUsername(request.username());

    return queryResult.map(Account::toDto).orElse(null);

  }

}
