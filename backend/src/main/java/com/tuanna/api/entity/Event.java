package com.tuanna.api.entity;

import java.io.Serial;

import org.hibernate.annotations.DialectOverride.SQLRestriction;
import org.hibernate.annotations.SQLDelete;

import com.tuanna.api.dto.EventDto;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity(name = "Event")
@Table(name = "t_event")
@SQLDelete(sql = "UPDATE t_event SET is_deleted = true WHERE id = ?")
@SQLRestriction(dialect = org.hibernate.dialect.PostgreSQLDialect.class,
    override = @org.hibernate.annotations.SQLRestriction("is_deleted = false"))
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Event extends BaseEntity {

  @Serial
  private static final long serialVersionUID = 1032972432116090594L;

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(columnDefinition = "text")
  private String title;
  
  @Column(columnDefinition = "text")
  private String name;

  @Column(columnDefinition = "text")
  private String description;

  @OneToOne(mappedBy = "event")
  private StudentEvent studentEvent;

  public EventDto toDto() {
    var dto = new EventDto(this.getId(), this.getName());
    return dto;
  }

}
