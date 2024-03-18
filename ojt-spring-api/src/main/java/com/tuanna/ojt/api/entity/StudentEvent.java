package com.tuanna.ojt.api.entity;

import com.tuanna.ojt.api.constants.EventStatus;
import com.tuanna.ojt.api.constants.converter.EventStatusConverter;

import jakarta.persistence.Convert;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity(name = "OjtStudentEvent")
@Table(name = "ojt_student_event")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StudentEvent extends BaseEntity {

  private static final long serialVersionUID = 1025932825083679424L;

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @ManyToOne(fetch = FetchType.LAZY)
  private Event detail;

  @Convert(converter = EventStatusConverter.class)
  private EventStatus status;

}
