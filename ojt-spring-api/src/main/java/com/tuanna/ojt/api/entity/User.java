package com.tuanna.ojt.api.entity;

import com.tuanna.ojt.api.constants.AccountRole;
import com.tuanna.ojt.api.constants.converter.AccountRoleConverter;
import jakarta.persistence.Column;
import jakarta.persistence.Convert;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity(name = "OjtUser")
@Table(name = "ojt_user")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class User extends BaseEntity {

  private static final long serialVersionUID = -5925025823115269763L;

  @Id
  private Long id;
  
  @Column(columnDefinition = "text")
  private String name;
  
  @Convert(converter = AccountRoleConverter.class)
  private AccountRole role;
  
  @OneToOne(mappedBy = "user")
  private Account account;
  
  
  @Override
  public boolean equals(final Object o) {
    if (o == this)
      return true;
    if (!(o instanceof final User user)) {
      return false;
    }
    return this.id != null && this.id.equals(user.getId());
  }

  @Override
  public int hashCode() {
    return this.getClass().hashCode();
  }
}
