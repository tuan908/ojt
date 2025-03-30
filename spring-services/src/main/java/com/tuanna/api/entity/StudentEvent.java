package com.tuanna.api.entity;

import java.io.Serial;
import java.io.Serializable;
import java.util.LinkedHashSet;
import java.util.Map;
import java.util.Set;

import org.hibernate.annotations.DialectOverride.SQLRestriction;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.Type;
import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.tuanna.api.constant.EventStatus;
import com.tuanna.api.constant.converter.EventStatusConverter;
import com.tuanna.api.dto.StudentEventDto;
import com.tuanna.api.dto.StudentDto;
import io.hypersistence.utils.hibernate.type.json.JsonType;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Convert;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.OrderBy;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity(name = "StudentEvent")
@Table(name = "t_student_event")
@SQLDelete(sql = "UPDATE t_student_event SET is_deleted = true WHERE id = ?")
@SQLRestriction(dialect = org.hibernate.dialect.PostgreSQLDialect.class,
    override = @org.hibernate.annotations.SQLRestriction("is_deleted = false"))
@Getter
@Setter
@NoArgsConstructor
@Builder
@AllArgsConstructor
public class StudentEvent extends BaseEntity {

  @Serial
  private static final long serialVersionUID = 1025932825083679424L;

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @OneToOne(cascade = CascadeType.ALL)
  @JoinColumn(name = "event_id", referencedColumnName = "id")
  private Event event;

  @Convert(converter = EventStatusConverter.class)
  private EventStatus eventStatus;

  @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true)
  @JoinColumn(name = "student_event_id")
  @OrderBy("createdAt ASC")
  @Builder.Default
  private Set<Comment> comments = new LinkedHashSet<>();

  @ManyToOne(fetch = FetchType.LAZY)
  private Grade grade;

  @ManyToOne(fetch = FetchType.LAZY)
  private Student student;

  @Type(JsonType.class)
  @Column(columnDefinition = "jsonb")
  private Data data;

  @Getter
  @Setter
  @AllArgsConstructor
  @NoArgsConstructor
  @Builder
  public static class Data implements Serializable {
    @Serial
    @JsonIgnore
    private static final long serialVersionUID = 6365386061637591425L;
    private String eventName;
    private String eventsInSchoolLife;
    private String myAction;
    private String myThought;
    private String shownPower;
    private String strengthGrown;

    @JsonCreator
    public static Data fromJson(Map<String, Object> props) {
      return Data
          .builder()
          .eventName(getStringOrNull(props, "eventName"))
          .eventsInSchoolLife(getStringOrNull(props, "eventsInSchoolLife"))
          .myAction(getStringOrNull(props, "myAction"))
          .myThought(getStringOrNull(props, "myThought"))
          .shownPower(getStringOrNull(props, "shownPower"))
          .strengthGrown(getStringOrNull(props, "strengthGrown"))
          .build();
    }

    // Utility method to safely extract string values
    private static String getStringOrNull(Map<String, Object> props, String key) {
      Object value = props.get(key);
      return value != null ? value.toString() : null;
    }
  }

  public StudentDto.EventData toEventDataDto() {
    var dto = StudentDto.EventData
        .builder()
        .studentEventId(this.id)
        .eventName(this.event.getName())
        .grade(this.grade.getName())
        .status(this.eventStatus.getValue())
        .commentCount(Long.valueOf(this.comments.size()))
        .build();
    return dto;
  }

  public StudentEventDto toStudentEventDto() {
    var dto = new StudentEventDto(
        this.id,
        this.grade.getName(),
        this.event.getName(),
        this.eventStatus.getValue(),
        data,
        this.comments.stream().map(Comment::toDto).toList());
    return dto;
  }

}
