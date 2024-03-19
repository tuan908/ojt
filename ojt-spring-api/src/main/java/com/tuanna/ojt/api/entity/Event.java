package com.tuanna.ojt.api.entity;

import com.tuanna.ojt.api.constants.EventStatus;
import com.tuanna.ojt.api.constants.converter.EventStatusConverter;
import jakarta.persistence.CascadeType;
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
  private java.util.Set<Comment> comments = new java.util.HashSet<>();
}
