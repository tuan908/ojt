package com.tuanna.api.service.impl;

import java.util.Comparator;
import java.util.List;
import java.util.ResourceBundle;

import org.springframework.lang.NonNull;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.tuanna.api.constant.ResponseCode;
import com.tuanna.api.constant.ResponseType;
import com.tuanna.api.dto.AddCommentDto;
import com.tuanna.api.dto.ApiResponse;
import com.tuanna.api.dto.CommentDto;
import com.tuanna.api.entity.Comment;
import com.tuanna.api.repository.CommentRepository;
import com.tuanna.api.repository.EventDetailRepository;
import com.tuanna.api.repository.UserRepository;
import com.tuanna.api.service.CommentService;

import jakarta.persistence.EntityManager;

@Service
@Transactional(readOnly = true)
public class CommentServiceImpl implements CommentService {

  private final @NonNull EntityManager entityManager;

  private final @NonNull EventDetailRepository eventDetailRepository;

  private final @NonNull UserRepository userRepository;

  private final @NonNull CommentRepository commentRepository;

  private final ResourceBundle rb;

  public CommentServiceImpl(
      EntityManager entityManager,
      EventDetailRepository eventDetailRepository,
      UserRepository userRepository,
      CommentRepository commentRepository) {
    super();
    this.entityManager = entityManager;
    this.eventDetailRepository = eventDetailRepository;
    this.userRepository = userRepository;
    this.commentRepository = commentRepository;
    rb = ResourceBundle.getBundle("messages");
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

    if (eventDetail == null) {
      return null;
    }

    var user = this.userRepository.findByUsername(dto.username()).orElse(null);

    if (user == null) {
      return null;
    }

    var newComment = Comment.builder().user(user).content(dto.content()).build();

    newComment.setIsDeleted(false);

    eventDetail.getComments().add(newComment);

    this.entityManager.persist(eventDetail);
    this.entityManager.flush();

    var updatedComments = eventDetail
        .getComments()
        .stream()
        .sorted(Comparator.comparing(Comment::getCreatedAt))
        .map(Comment::toDto)
        .toList();

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
  public ApiResponse<Object> delete(String studentCode, Long eventDetailId, Long commentId) {
    var qlString = """
        select
        	c
        from
        	com.tuanna.api.entity.Comment c
        	join com.tuanna.api.entity.EventDetail u on u.id = c.eventDetail.id
        where
        	u.id = ?1
        	and c.id = ?2
        """;

    var q = this.entityManager.createQuery(qlString);
    q.setParameter(1, eventDetailId);
    q.setParameter(2, commentId);

    var result = q.getResultStream().findFirst();

    if (result.isEmpty()) {
      return ApiResponse
          .error(ResponseCode.NOT_FOUND.getValue(), rb.getString("error.not-found"),
              ResponseType.ERROR.getValue());
    }
    this.commentRepository.deleteById(commentId);
    return ApiResponse.success(null, rb.getString("ok"));
  }
}
