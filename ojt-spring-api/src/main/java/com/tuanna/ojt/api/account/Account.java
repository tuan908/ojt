package com.tuanna.ojt.api.account;

import java.io.Serializable;
import java.time.LocalDateTime;
import jakarta.persistence.Convert;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity(name = "OjtAccount")
@Table(name = "ojt_account")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Account implements Serializable {

  private static final long serialVersionUID = -4933070410983894176L;

  @Id
  @GeneratedValue(strategy = GenerationType.AUTO)
  private Long id;

  private String name;

  private String username;

  private String password;

  @Convert(converter = AccountRoleConverter.class)
  private AccountRole role;

  private LocalDateTime createdTime;

  private LocalDateTime updatedTime;
  
}
