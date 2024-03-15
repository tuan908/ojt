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
            a
          from
            com.tuanna.ojt.api.account.Account a
          where
            a.username = ?1
        """;

    var query = this.em.createQuery(qlString, Account.class);
    query.setParameter(1, request.username());

    AccountDto result = null;
    var queryResult = query.getResultStream().findFirst().orElse(null);

    if (queryResult != null) {
      result = new AccountDto(queryResult.getId(), null, queryResult.getName(),
          queryResult.getUsername(), queryResult.getPassword(), queryResult.getRole());
    }

    return result;

  }

}
