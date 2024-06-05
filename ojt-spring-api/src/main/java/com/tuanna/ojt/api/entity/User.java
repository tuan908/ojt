package com.tuanna.ojt.api.entity;

import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;
import org.hibernate.annotations.NaturalId;
import org.hibernate.annotations.NaturalIdCache;
import com.tuanna.ojt.api.constant.UserRole;
import com.tuanna.ojt.api.constant.converter.UserRoleConverter;
import com.tuanna.ojt.api.dto.UserDto;
import jakarta.persistence.Column;
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

@Entity(name = "OjtUser")
@Table(name = "ojt_user")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
@NaturalIdCache
public class User extends BaseEntity {

  private static final long serialVersionUID = -5925025823115269763L;

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(columnDefinition = "text")
  private String name;

  @Column(unique = true, nullable = false, columnDefinition = "text")
  @NaturalId
  private String username;

  @Column(nullable = false, columnDefinition = "text")
  private String password; // Hashed password

  @Convert(converter = UserRoleConverter.class)
  @Column(columnDefinition = "text")
  private UserRole role;

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

  public UserDto toDto() {
    var dto = new UserDto(this.id, this.name, this.username, this.role.getValue());
    return dto;
  }

}
