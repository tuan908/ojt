package com.tuanna.api.service.impl;

import java.util.Comparator;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.tuanna.api.dto.AddCommentDto;
import com.tuanna.api.dto.CommentDto;
import com.tuanna.api.entity.Comment;
import com.tuanna.api.repository.CommentRepository;
import com.tuanna.api.repository.EventDetailRepository;
import com.tuanna.api.repository.UserRepository;
import com.tuanna.api.service.CommentService;

import jakarta.persistence.EntityManager;
import lombok.RequiredArgsConstructor;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor(onConstructor_ = {@Autowired})
public class CommentServiceImpl implements CommentService {

  private final @NonNull EntityManager entityManager;

  private final @NonNull EventDetailRepository eventDetailRepository;

  private final @NonNull UserRepository userRepository;

  private final @NonNull CommentRepository commentRepository;

  @Override
  public List<CommentDto> findByEventDetailId(Long eventDetailId) {
    // TODO Auto-generated method stub
    return null;
  }

  @Override
  public Comment findById(Long id) {
    // TODO Auto-generated method stub
    return null;
  }

  @Override
  @Transactional
  public List<CommentDto> add(AddCommentDto dto) {
    var eventDetail = this.eventDetailRepository.findById(dto.eventDetailId()).orElse(null);

    if (eventDetail == null) {
      return null;
    }

    var user = this.userRepository.findByUsername(dto.username()).orElse(null);

    if (user == null) {
      return null;
    }

    var newComment = Comment.builder().user(user).content(dto.content()).isDeleted(false).build();

    eventDetail.getComments().add(newComment);

    this.entityManager.persist(eventDetail);
    this.entityManager.flush();

    var updatedComments = eventDetail.getComments().stream()
        .sorted(Comparator.comparing(Comment::getCreatedAt)).map(Comment::toDto).toList();

    return updatedComments;
  }

  @Override
  @Transactional
  public CommentDto update(CommentDto commentDto) {
    var comment = this.commentRepository.findById(commentDto.id()).orElse(null);

    if (comment == null) {
      return null;
    }

    comment.setContent(commentDto.content());
    comment.setUpdatedAt(java.time.LocalDateTime.now());
    this.commentRepository.saveAndFlush(comment);
    return comment.toDto();
  }

  @Override
  @Transactional
  public void delete(Long id) {
    var stringBuilder = new StringBuilder();

    stringBuilder.append("""
        update
          com.tuanna.api.entity.Comment
        set
          isDeleted = true
        where
          id = :id
         """);
    var query = this.entityManager.createQuery(stringBuilder.toString());
    query.setParameter("id", id);
    query.executeUpdate();
  }

}
