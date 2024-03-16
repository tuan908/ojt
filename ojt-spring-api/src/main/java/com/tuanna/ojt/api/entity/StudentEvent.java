package com.tuanna.ojt.api.entity;

import com.tuanna.ojt.api.constants.EventStatus;
import com.tuanna.ojt.api.constants.converter.EventStatusConverter;

import jakarta.persistence.Convert;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
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

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne()
    @JoinColumn(name = "student_id")
    private User student;

    @ManyToOne()
    @JoinColumn(name = "event_id")
    private Event event;

    @Convert(converter = EventStatusConverter.class)
    private EventStatus eventStatus;
}
