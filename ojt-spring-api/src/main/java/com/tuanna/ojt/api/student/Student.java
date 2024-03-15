package com.tuanna.ojt.api.student;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import com.tuanna.ojt.api.event.Event;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity(name = "OjtStudent")
@Table(name = "ojt_student")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Student implements Serializable {

  private static final long serialVersionUID = 6414057690182590706L;

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  private String code;

  private String name;

  private LocalDateTime createdTime;

  private LocalDateTime updatedTime;

  @ManyToMany(mappedBy = "students", cascade = {CascadeType.PERSIST, CascadeType.MERGE})
  @Builder.Default
  private List<Event> events = new ArrayList<>();

  public void addEvent(Event event) {
    this.events.add(event);
    event.getStudents().add(this);
  }

  public void removeEvent(Event event) {
    this.events.remove(event);
    event.getStudents().remove(this);
  }

  public void remove() {
    for (Event event : new ArrayList<>(this.events)) {
      this.removeEvent(event);
    }
  }
}
