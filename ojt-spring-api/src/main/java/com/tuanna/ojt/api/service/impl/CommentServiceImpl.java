package com.tuanna.ojt.api.service.impl;

import java.util.Comparator;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.tuanna.ojt.api.dto.AddCommentDto;
import com.tuanna.ojt.api.dto.CommentDto;
import com.tuanna.ojt.api.entity.Comment;
import com.tuanna.ojt.api.repository.CommentRepository;
import com.tuanna.ojt.api.repository.EventDetailRepository;
import com.tuanna.ojt.api.repository.UserRepository;
import com.tuanna.ojt.api.service.CommentService;
import jakarta.persistence.EntityManager;

@Service
@Transactional(readOnly = true)
public class CommentServiceImpl implements CommentService {

  private final EntityManager entityManager;

  private final EventDetailRepository eventDetailRepository;

  private final UserRepository userRepository;

  private final CommentRepository commentRepository;

  public CommentServiceImpl(final EntityManager entityManager,
      final EventDetailRepository eventDetailRepository, final UserRepository userRepository,
      final CommentRepository commentRepository) {
    this.entityManager = entityManager;
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
  @Transactional
  public CommentDto update(CommentDto commentDto) {
    var comment = this.commentRepository.findById(commentDto.id()).orElse(null);
    
    if(comment == null) {
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
