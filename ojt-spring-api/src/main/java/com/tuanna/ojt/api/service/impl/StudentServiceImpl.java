package com.tuanna.ojt.api.service.impl;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.tuanna.ojt.api.dto.EventDto;
import com.tuanna.ojt.api.dto.HashtagDto;
import com.tuanna.ojt.api.dto.StudentEventRequestDto;
import com.tuanna.ojt.api.dto.StudentEventResponseDto;
import com.tuanna.ojt.api.entity.Student;
import com.tuanna.ojt.api.service.StudentService;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;

@Service
@Transactional(readOnly = true)
public class StudentServiceImpl implements StudentService {

        @PersistenceContext
        private EntityManager entityManager;

        @Override
        public List<StudentEventResponseDto> getAll(StudentEventRequestDto dto) {
                var qlString = """
                                select
                                        s
                                from
                                        com.tuanna.ojt.api.entity.Student s
                                join fetch
                                        s.eventList
                                where
                                        1 = 1
                                        """;
                var query = this.entityManager.createQuery(qlString, Student.class);
                var students = query.getResultList();

                var list = students.stream().map(student -> {
                        var events = student.getEventList().stream().map(
                                        event -> {
                                                var eventDto = new EventDto(event.getDetail().getId(),
                                                                event.getDetail().getName(),
                                                                event.getStatus().getValue());
                                                return eventDto;
                                        })
                                        .collect(Collectors.toUnmodifiableList());
                        var hashtags = student.getHashtagList().stream().map(
                                        hashtag -> {
                                                var hashtagDto = new HashtagDto(hashtag.getId(), hashtag.getName(),
                                                                hashtag.getColor());
                                                return hashtagDto;
                                        })
                                        .collect(Collectors.toUnmodifiableSet());
                        var responseDto = new StudentEventResponseDto(student.getCode(), student.getName(), events,
                                        hashtags);
                        return responseDto;
                }).toList();
                // var list = this.studentRepository.findAll();
                return list;
        }

        @Override
        public StudentEventResponseDto getByCode(String code) {
                var qlString = """
                                select
                                        s
                                from
                                        com.tuanna.ojt.api.entity.Student s
                                join fetch
                                        s.eventList
                                where
                                        1 = 1
                                and
                                        s.code = ?1
                                        """;
                var query = this.entityManager.createQuery(qlString, Student.class);
                query.setParameter(1, code);
                var student = query.getResultStream().findFirst().orElse(null);

                if (student != null) {
                        var events = student.getEventList().stream().map(
                                        event -> {
                                                var eventDto = new EventDto(event.getDetail().getId(),
                                                                event.getDetail().getName(),
                                                                event.getStatus().getValue());
                                                return eventDto;
                                        })
                                        .collect(Collectors.toUnmodifiableList());
                        var hashtags = student.getHashtagList().stream().map(
                                        hashtag -> {
                                                var hashtagDto = new HashtagDto(hashtag.getId(), hashtag.getName(),
                                                                hashtag.getColor());
                                                return hashtagDto;
                                        })
                                        .collect(Collectors.toUnmodifiableSet());
                        var result = new StudentEventResponseDto(student.getCode(), student.getName(), events,
                                        hashtags);
                        return result;
                }
                return null;

        }

}
