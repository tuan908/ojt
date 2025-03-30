package com.tuanna.api.service;

import java.util.List;

import com.tuanna.api.dto.AddCommentDto;
import com.tuanna.api.dto.ApiResponse;
import com.tuanna.api.dto.CommentDto;
import com.tuanna.api.dto.CreateDto;
import com.tuanna.api.entity.Comment;

public interface CommentService {

  ApiResponse<List<CommentDto>> findByEventDetailId(Long eventDetailId);

  ApiResponse<Comment> findById(Long id);

  ApiResponse<CreateDto> create(AddCommentDto addCommentDto);

  ApiResponse<CommentDto> update(CommentDto commentDto);

  ApiResponse<Object> delete(Long studentEventId, Long commentId);

}
