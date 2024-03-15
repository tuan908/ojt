package com.tuanna.ojt.api.repository;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import com.tuanna.ojt.api.dto.AccountDto;
import com.tuanna.ojt.api.entity.Account;

public interface AccountRepository extends JpaRepository<Account, Long> {
  
  Optional<Account> findByUsername(@Param("username") String username);
  
}
