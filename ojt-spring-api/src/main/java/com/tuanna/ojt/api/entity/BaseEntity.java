package com.tuanna.ojt.api.entity;

import java.io.Serializable;
import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.MappedSuperclass;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@MappedSuperclass
public abstract class BaseEntity implements Serializable {

  private static final long serialVersionUID = -6447104920246140053L;

  @Column(nullable = false, updatable = false)
  private LocalDateTime createAt;

  @Column(nullable = false)
  private LocalDateTime updatedAt;

}
