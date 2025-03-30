package com.tuanna.api.entity;

import java.io.Serial;
import java.util.Comparator;
import java.util.Set;

import org.hibernate.annotations.DialectOverride.SQLRestriction;
import org.hibernate.annotations.SQLDelete;

import com.tuanna.api.dto.StudentsDto;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity(name = "Student")
@Table(name = "t_student")
@SQLDelete(sql = "UPDATE t_student SET is_deleted = true WHERE id = ?")
@SQLRestriction(dialect = org.hibernate.dialect.PostgreSQLDialect.class,
    override = @org.hibernate.annotations.SQLRestriction("is_deleted = false"))
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Student extends BaseEntity {

  @Serial
  private static final long serialVersionUID = -6397969402551800433L;

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(columnDefinition = "text")
  private String code;

  @OneToMany(mappedBy = "student", cascade = CascadeType.ALL)
  private Set<StudentHashtag> studentHashtags;

  @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true, mappedBy = "student")
  private Set<StudentEvent> studentEvents;

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
  public StudentsDto toDto() {
    var events = this
        .getStudentEvents()
        .stream()
        .sorted(Comparator.comparing(event -> event.getEvent().getName()))
        .map(event -> event.getEvent().getName())
        .toList();
    var hashtags = this
        .getStudentHashtags()
        .stream()
        .map(StudentHashtag::getHashtag)
        .sorted(Comparator.comparing(Hashtag::getName))
        .map(Hashtag::toDto)
        .toList();

    return new StudentsDto(
        this.id,
        this.code,
        this.user.getName(),
        this.grade.getName(),
        String.join(", ", events),
        hashtags);
  }

  public void addHashtag(Hashtag hashtag) {
    this.studentHashtags.stream().map(StudentHashtag::getHashtag).toList().add(hashtag);
    hashtag.getStudentHashtags().stream().map(StudentHashtag::getStudent).toList().add(this);
  }

  public void removeHashtag(Long hashtagId) {
    var hashtag = this.studentHashtags
        .stream()
        .map(StudentHashtag::getHashtag)
        .filter(t -> t.getId() == hashtagId)
        .findFirst()
        .orElse(null);
    if (hashtag != null) {
      this.studentHashtags.stream().map(StudentHashtag::getHashtag).toList().remove(hashtag);
      hashtag.getStudentHashtags().stream().map(StudentHashtag::getStudent).toList().remove(this);
    }
  }
}
