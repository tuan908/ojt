package com.tuanna.ojt.api.service.impl;

import java.util.Comparator;
import java.util.List;
import jakarta.persistence.EntityManager;
import org.springframework.data.jpa.repository.JpaContext;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.tuanna.ojt.api.dto.AddCommentDto;
import com.tuanna.ojt.api.dto.CommentDto;
import com.tuanna.ojt.api.dto.UpdateCommentDto;
import com.tuanna.ojt.api.entity.Comment;
import com.tuanna.ojt.api.repository.CommentRepository;
import com.tuanna.ojt.api.repository.EventDetailRepository;
import com.tuanna.ojt.api.repository.UserRepository;
import com.tuanna.ojt.api.service.CommentService;

@Service
@Transactional(readOnly = true)
public class CommentServiceImpl implements CommentService {

  private final EntityManager entityManager;

  private final EventDetailRepository eventDetailRepository;

  private final UserRepository userRepository;

  private final CommentRepository commentRepository;

  public CommentServiceImpl(final JpaContext jpaContext,
      final EventDetailRepository eventDetailRepository, final UserRepository userRepository,
      final CommentRepository commentRepository) {
    this.entityManager = jpaContext.getEntityManagerByManagedType(Comment.class);
    this.eventDetailRepository = eventDetailRepository;
    this.userRepository = userRepository;
    this.commentRepository = commentRepository;
  }

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

    if (eventDetail != null) {
      var user = this.userRepository.findByUsername(dto.username()).orElse(null);

      if (user != null) {
        // @formatter:off
        var newComment = Comment.builder()
          .user(user)
          .content(dto.content())
          .isDeleted(false)
          .build();
        // @formatter:on

        eventDetail.getComments().add(newComment);

        this.entityManager.persist(eventDetail);
        this.entityManager.flush();
      }

      // @formatter:off
      var updatedCommentList = eventDetail.getComments()
          .stream()
          .sorted(Comparator.comparing(Comment::getCreatedAt))
          .map(Comment::toDto)
          .toList();
      // @formatter:on

      return updatedCommentList;
    }

    return null;
  }

  @Override
  public void update(Long id, UpdateCommentDto updateCommentDto) {
    var comment = this.commentRepository.findById(id).orElse(null);

    if (comment != null) {
      comment.setContent(updateCommentDto.content());
      comment.setUpdatedAt(java.time.LocalDateTime.now());
      this.commentRepository.saveAndFlush(comment);
    }

  }

  @Override
  @Transactional
  public void delete(Long id) {
    var stringBuilder = new StringBuilder();

    stringBuilder.append("""
        update
          com.tuanna.ojt.api.entity.Comment
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
