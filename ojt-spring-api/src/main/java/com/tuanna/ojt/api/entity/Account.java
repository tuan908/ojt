package com.tuanna.ojt.api.entity;

import com.tuanna.ojt.api.dto.AccountDto;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
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
public class Account extends BaseEntity {
  
  private static final long serialVersionUID = -7486809986693434138L;

  @Id
  private Long id;

  @Column(columnDefinition = "text")
  private String username;

  @Column(columnDefinition = "text")
  private String password;
  
  @OneToOne
  @JoinColumn(name = "user_id")
  private User user;
  
  @Override
  public boolean equals(final Object o) {
    if (o == this)
      return true;
    if (!(o instanceof final Account account)) {
      return false;
    }
    return this.id != null && this.id.equals(account.getId());
  }

  @Override
  public int hashCode() {
    return this.getClass().hashCode();
  }
  
  public AccountDto toDto() {
    return new AccountDto(
          this.id, 
          this.getUser().getName(),
          null,
          this.getUser().getRole().getValue()
        );
  }

}
