package com.tuanna.api.service;

import java.util.List;

import com.tuanna.api.dto.AddCommentDto;
import com.tuanna.api.dto.CommentDto;
import com.tuanna.api.entity.Comment;

public interface CommentService {

  List<CommentDto> findByEventDetailId(Long eventDetailId);
  
  Comment findById(Long id);
  
  List<CommentDto> add(AddCommentDto addCommentDto);
  
  CommentDto update(CommentDto commentDto);
  
  void delete(Long id);
  
}
