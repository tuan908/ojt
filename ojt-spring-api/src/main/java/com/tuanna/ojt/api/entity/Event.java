package com.tuanna.ojt.api.entity;

import org.hibernate.annotations.Type;
import com.tuanna.ojt.api.constants.EventStatus;
import com.tuanna.ojt.api.constants.converter.EventStatusConverter;
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
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity(name = "OjtEvent")
@Table(name = "ojt_event")
@Getter
@Setter
@NoArgsConstructor
public class Event extends BaseEntity {

  private static final long serialVersionUID = 1025932825083679424L;

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @ManyToOne(fetch = FetchType.LAZY)
  private EventDetail detail;

  @Convert(converter = EventStatusConverter.class)
  private EventStatus status;

  @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true)
  @JoinColumn(name = "event_detail_id")
  private java.util.Set<Comment> comments;
  
  @ManyToOne(fetch = FetchType.LAZY)
  private Grade grade;
  
  private String createdBy;
  
  private String updatedBy;
  
  @Type(JsonType.class)
  @Column(columnDefinition = "jsonb")
  private EventData data;
  
  
  @Getter
  @Setter
  @AllArgsConstructor
  @NoArgsConstructor
  public class EventData {
    private String eventName;
    private String eventsInSchoolLife;
    private String myAction;
    private String myThought;
    private String shownPower;
    private String strengthGrown;
    
  }
}


