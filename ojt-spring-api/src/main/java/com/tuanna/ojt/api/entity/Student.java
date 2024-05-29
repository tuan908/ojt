package com.tuanna.ojt.api.entity;

import java.util.Comparator;
import java.util.Set;
import org.springframework.util.StringUtils;
import com.tuanna.ojt.api.dto.EventDetailDto;
import com.tuanna.ojt.api.dto.HashtagDto;
import com.tuanna.ojt.api.dto.StudentEventResponseDto;
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

  @ManyToMany
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
  
  public StudentEventResponseDto toDto() {
    var events = this.getEvents().stream().map(event -> {
      var eventDto = new EventDetailDto(event.getId(), event.getGrade().getName(),
          !StringUtils.hasText(event.getDetail().getName()) ? "" : event.getDetail().getName(),
          event.getStatus().getValue(), event.getData(), event.getComments().stream()
              .sorted(Comparator.comparing(Comment::getCreatedAt)).map(Comment::toDto).toList());
      return eventDto;
    }).sorted(Comparator.comparing(EventDetailDto::name)).toList();

    var hashtags = this.getHashtags().stream()
        .map(Hashtag::toDto)
        .sorted(Comparator.comparing(HashtagDto::name)).toList();

    var responseDto = new StudentEventResponseDto(this.getCode(), this.getName(),
        this.getGrade().getName(), events, hashtags);
    return responseDto;
  }
}
