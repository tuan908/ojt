package com.tuanna.ojt.api.entity;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity(name = "OjtEvent")
@Table(name = "ojt_event")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Event extends BaseEntity {

  private static final long serialVersionUID = 1032972432116090594L;

  @Id
  private Long id;

  @Column(columnDefinition = "text")
  private String name;

  @Column(columnDefinition = "text")
  private String title;

  @Column(columnDefinition = "text")
  private String description;

  @OneToMany(mappedBy = "detail", cascade = CascadeType.ALL, orphanRemoval = true)
  @Builder.Default
  private java.util.SortedSet<StudentEvent> studentEvents = new java.util.TreeSet<>();
}
