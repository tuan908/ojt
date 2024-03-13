package com.tuanna.ojt.api.account;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true)
public class AccountServiceImpl implements AccountService {

  @PersistenceContext
  private EntityManager em;

  @Override
  public AccountDto getOneBy(AccountDto request) {
    var qlString = """
          select
            new com.tuanna.ojt.api.account.AccountDto(a.id, a.name, a.username, a.password, a.role)
          from
            com.tuanna.ojt.api.account.Account a
          where
            a.username = ?1
        """;

    var query = this.em.createQuery(qlString, AccountDto.class);
    query.setParameter(1, request.username());

    var result = query.getResultStream().findFirst().orElse(null);

    return result;

  }

}
