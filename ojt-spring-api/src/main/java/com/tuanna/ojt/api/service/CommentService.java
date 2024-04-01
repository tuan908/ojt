package com.tuanna.ojt.api.service;

import java.util.List;
import com.tuanna.ojt.api.dto.AddCommentDto;
import com.tuanna.ojt.api.dto.CommentDto;
import com.tuanna.ojt.api.dto.UpdateCommentDto;
import com.tuanna.ojt.api.entity.Comment;

public interface CommentService {

  List<CommentDto> findByEventDetailId(Long eventDetailId);
  
  Comment findById(Long id);
  
  List<CommentDto> add(AddCommentDto addCommentDto);
  
  void update(Long id, UpdateCommentDto updateCommentDto);
  
  void delete(Long id);
  
}
