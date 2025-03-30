package com.tuanna.api.service.impl;

import java.util.List;
import java.util.ResourceBundle;

import org.springframework.lang.NonNull;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.tuanna.api.constant.ErrorCodes;
import com.tuanna.api.constant.ResponseType;
import com.tuanna.api.dto.AddCommentDto;
import com.tuanna.api.dto.ApiResponse;
import com.tuanna.api.dto.CommentDto;
import com.tuanna.api.dto.CreateDto;
import com.tuanna.api.entity.Comment;
import com.tuanna.api.repository.CommentRepository;
import com.tuanna.api.repository.StudentEventRepository;
import com.tuanna.api.repository.UserRepository;
import com.tuanna.api.service.CommentService;

import jakarta.persistence.EntityManager;

@Service
@Transactional(readOnly = true)
public class CommentServiceImpl implements CommentService {

  private final @NonNull EntityManager entityManager;

  private final @NonNull StudentEventRepository eventDetailRepository;

  private final @NonNull UserRepository userRepository;

  private final @NonNull CommentRepository commentRepository;

  private final ResourceBundle rb;

  public CommentServiceImpl(
      EntityManager entityManager,
      StudentEventRepository eventDetailRepository,
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
  public ApiResponse<List<CommentDto>> findByEventDetailId(Long eventDetailId) {
    // TODO Auto-generated method stub
    return null;
  }

  @Override
  public ApiResponse<Comment> findById(Long id) {
    // TODO Auto-generated method stub
    return null;
  }

  @Override
  @Transactional
  public ApiResponse<CreateDto> create(AddCommentDto dto) {
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


    return ApiResponse.success(new CreateDto(newComment.getId()), null);
  }

  @Override
  @Transactional
  public ApiResponse<CommentDto> update(CommentDto commentDto) {
    var comment = this.commentRepository.findById(commentDto.id()).orElse(null);

    if (comment == null) {
      return null;
    }

    comment.setContent(commentDto.content());
    comment.setUpdatedAt(java.time.LocalDateTime.now());
    this.commentRepository.saveAndFlush(comment);
    return ApiResponse.success(comment.toDto(), null);
  }

  @Override
  @Transactional
  public ApiResponse<Object> delete(Long studentEventId, Long commentId) {
    var qlString = """
        select
        	c
        from
        	com.tuanna.api.entity.Comment c
        where
        	u.id = ?1
        """;

    var q = this.entityManager.createQuery(qlString, Comment.class);
    q.setParameter(1, commentId);

    Comment result = q.getResultStream().findFirst().orElse(null);

    if (result == null) {
      return ApiResponse
          .error(ErrorCodes.NOT_FOUND.getValue(), rb.getString("error.not-found"),
              ResponseType.ERROR.getValue());
    }
    result.softDelete();
    this.entityManager.merge(result);
    this.entityManager.flush();
    return ApiResponse.success(null, rb.getString("ok"));
  }
}
