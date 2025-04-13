package com.tuanna.api.entity;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.MapsId;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode
@Entity
@Table(name = "t_student_hashtag")
public class StudentHashtag implements Serializable {

  private static final long serialVersionUID = -384956749425769473L;

  @Getter
  @Setter
  @NoArgsConstructor
  @AllArgsConstructor
  @EqualsAndHashCode
  @Embeddable
  public static final class StudentHashtagId implements Serializable {

    private static final long serialVersionUID = -8111760454852187410L;

    private Long studentId;

    private Long studentEventId;

    private Long hashtagId;

  }

  @EmbeddedId
  private StudentHashtagId id;

  @ManyToOne
  @MapsId("studentId") // Maps to Student ID in composite key
  @JoinColumn(name = "student_id")
  private Student student;

  @ManyToOne
  @MapsId("hashtagId") // Maps to Course ID in composite key
  @JoinColumn(name = "hashtag_id")
  private Hashtag hashtag;

  @ManyToOne
  @MapsId("studentEventId") // Maps to Course ID in composite key
  @JoinColumn(name = "student_event_id")
  private StudentEvent studentEvent;

  private Long count;

  @Column(name = "created_at", nullable = false, updatable = false)
  private LocalDateTime createdAt;

  @Column(name = "updated_at", nullable = false)
  private LocalDateTime updatedAt;

  @Column(name = "is_deleted", nullable = false)
  private Boolean isDeleted;

  @PrePersist
  public void prePersist() {
    LocalDateTime now = LocalDateTime.now(ZoneOffset.UTC);
    this.setCreatedAt(now);
    this.setUpdatedAt(now);
    this.setIsDeleted(false);
  }

  @PreUpdate
  public void preUpdate() {
    this.setUpdatedAt(LocalDateTime.now(ZoneOffset.UTC));
  }
}
