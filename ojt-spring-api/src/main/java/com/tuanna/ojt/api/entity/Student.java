package com.tuanna.ojt.api.entity;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;
import org.hibernate.annotations.NaturalId;
import org.hibernate.annotations.NaturalIdCache;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
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
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
@NaturalIdCache
public class Student extends BaseEntity implements Serializable {

  private static final long serialVersionUID = 6414057690182590706L;
  
  @Id
  private Long id;

  @NaturalId
  @Column(columnDefinition = "text")
  private String code;

  @Column(columnDefinition = "text")
  private String name;

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
  
  @Override
  public boolean equals(final Object o) {
    if (o == this)
      return true;
    if (!(o instanceof final Student student)) {
      return false;
    }
    return this.id != null && this.id.equals(student.getId());
  }

  @Override
  public int hashCode() {
    return this.getClass().hashCode();
  }
}
