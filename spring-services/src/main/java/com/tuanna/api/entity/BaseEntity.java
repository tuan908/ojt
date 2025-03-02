package com.tuanna.api.entity;

import java.io.Serial;
import java.io.Serializable;
import java.time.LocalDateTime;
import jakarta.persistence.MappedSuperclass;
import jakarta.persistence.PrePersist;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@MappedSuperclass
public abstract class BaseEntity implements Serializable {

	@Serial
	private static final long serialVersionUID = -6447104920246140053L;

	private LocalDateTime createdAt;

	private LocalDateTime updatedAt;

	private Boolean isDeleted;

	@PrePersist
	public void prePersist() {
		this.setCreatedAt(LocalDateTime.now());
		this.setUpdatedAt(LocalDateTime.now());
		this.setIsDeleted(false);
	}

}
