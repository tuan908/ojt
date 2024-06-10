package com.tuanna.ojt.api.entity;

import java.util.Set;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import com.tuanna.ojt.api.dto.StudentEvent;
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
public class Student extends BaseEntity {

  private static final long serialVersionUID = -6397969402551800433L;

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(columnDefinition = "text")
  private String code;

  @Column(columnDefinition = "text")
  private String name;

  @ManyToMany(fetch = FetchType.LAZY, cascade = {CascadeType.PERSIST, CascadeType.MERGE})
  // @formatter:off
  @JoinTable(
      name = "ojt_student_hashtag", 
      joinColumns = @JoinColumn(name = "student_id"),
      inverseJoinColumns = @JoinColumn(name = "hashtag_id")
    )
  // @formatter:on
  @Builder.Default
  private Set<Hashtag> hashtags = new java.util.HashSet<>();

  @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true, mappedBy = "student")
  @Builder.Default
  private java.util.Set<EventDetail> events = new java.util.HashSet<>();

  @OneToOne(cascade = CascadeType.ALL)
  @JoinColumn(name = "user_id", referencedColumnName = "id")
  private User user;

  @ManyToOne(fetch = FetchType.LAZY)
  private Grade grade;

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

  /** Convert to dto from entity */
  public StudentEvent toDto() {
    var events = this.getEvents().stream().map(event -> event.getDetail().getName()).toList();
    var hashtags = this.getHashtags().stream().map(Hashtag::toDto).toList();

    return new StudentEvent(this.id, this.code, this.name, this.grade.getName(),
        String.join(", ", events), hashtags);
  }

  public void addHashtag(Hashtag hashtag) {
    this.hashtags.add(hashtag);
    hashtag.getStudents().add(this);
  }

  public void removeHashtag(Long hashtagId) {
    var hashtag =
        this.hashtags.stream().filter(t -> t.getId() == hashtagId).findFirst().orElse(null);
    if (hashtag != null) {
      this.hashtags.remove(hashtag);
      hashtag.getStudents().remove(this);
    }
  }
}
