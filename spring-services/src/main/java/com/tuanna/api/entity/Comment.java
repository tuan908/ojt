package com.tuanna.api.entity;

import java.io.Serial;
import java.time.format.DateTimeFormatter;

import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.DialectOverride.SQLRestriction;

import com.tuanna.api.dto.CommentDto;

import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity(name = "Comment")
@Table(name = "t_comment")
@SQLDelete(sql = "UPDATE t_comment SET is_deleted = true WHERE id = ?")
@SQLRestriction(dialect = org.hibernate.dialect.PostgreSQLDialect.class, override = @org.hibernate.annotations.SQLRestriction("is_deleted = false"))
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Comment extends BaseEntity {
	@Serial
	private static final long serialVersionUID = 5581420110882356388L;

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@OneToOne
	@JoinColumn(name = "user_id", referencedColumnName = "id")
	private User user;

	private String content;

	@ManyToOne(fetch = FetchType.LAZY)
	private EventDetail eventDetail;

	@Override
	public boolean equals(final Object o) {
		if (o == this)
			return true;
		if (!(o instanceof final Comment c)) {
			return false;
		}
		return this.id != null && this.id.equals(c.getId());
	}

	@Override
	public int hashCode() {
		return this.getClass().hashCode();
	}

	public CommentDto toDto() {

		var createdAt = this.getCreatedAt().format(DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm:ss.SSS"));

	// @formatter:off
    return new CommentDto(
          this.id,
          this.user.getName(),
          this.user.getUsername(),
          this.user.getRole().getValue(),
          this.content,
          createdAt,
          this.getIsDeleted()
        );
    // @formatter:on
	}

}
