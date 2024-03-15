package com.tuanna.ojt.api.entity;

import java.util.List;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
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

  @ManyToMany(cascade = {CascadeType.PERSIST, CascadeType.MERGE})
  @JoinTable(name = "ojt_student_event",
      joinColumns = {@JoinColumn(name = "event_id", referencedColumnName = "id")},
      inverseJoinColumns = {@JoinColumn(name = "student_id", referencedColumnName = "id")})
  private List<Student> students;
}
