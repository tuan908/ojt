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

  @Column(name = "created_on", columnDefinition = "TIMESTAMP(6) DEFAULT NOW()", updatable = false)
  private LocalDateTime createdOn;

  @Column(name = "created_by", updatable = false)
  private String createdBy;

  @Column(name = "updated_on", columnDefinition = "TIMESTAMP(6) DEFAULT NOW()")
  private LocalDateTime updatedOn;

  @Column(name = "updated_by")
  private String updatedBy;

}
