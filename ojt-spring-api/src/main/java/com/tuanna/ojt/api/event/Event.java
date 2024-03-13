package com.tuanna.ojt.api.event;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.List;
import com.tuanna.ojt.api.student.Student;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
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
public class Event implements Serializable {

  private static final long serialVersionUID = 1032972432116090594L;

  @Id
  @GeneratedValue(strategy = GenerationType.AUTO)
  private Long id;

  private String name;

  private LocalDateTime createdTime;

  private LocalDateTime updatedTime;

  @ManyToMany(cascade = {CascadeType.PERSIST, CascadeType.MERGE})
  @JoinTable(name = "ojt_student_event",
      joinColumns = {@JoinColumn(name = "event_id", referencedColumnName = "id")},
      inverseJoinColumns = {@JoinColumn(name = "student_id", referencedColumnName = "id")})
  private List<Student> students;
}
