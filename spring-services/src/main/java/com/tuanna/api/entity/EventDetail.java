package com.tuanna.api.entity;

import java.io.Serial;
import java.io.Serializable;
import java.util.Comparator;
import java.util.Set;

import org.hibernate.annotations.DialectOverride.SQLRestriction;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.Type;
import com.tuanna.api.constant.EventStatus;
import com.tuanna.api.constant.converter.EventStatusConverter;
import com.tuanna.api.dto.EventDetailDto;

import io.hypersistence.utils.hibernate.type.json.JsonType;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Convert;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity(name = "EventDetail")
@Table(name = "t_event_detail")
@SQLDelete(sql = "UPDATE t_event_detail SET is_deleted = true WHERE id = ?")
@SQLRestriction(dialect = org.hibernate.dialect.PostgreSQLDialect.class, override = @org.hibernate.annotations.SQLRestriction("is_deleted = false"))
@Getter
@Setter
@NoArgsConstructor
@Builder
@AllArgsConstructor
public class EventDetail extends BaseEntity {

	@Serial
	private static final long serialVersionUID = 1025932825083679424L;

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@OneToOne(cascade = CascadeType.ALL)
	@JoinColumn(name = "event_id", referencedColumnName = "id")
	private Event detail;

	@Convert(converter = EventStatusConverter.class)
	private EventStatus status;

	@OneToMany(cascade = CascadeType.ALL, orphanRemoval = true)
	@JoinColumn(name = "event_detail_id")
	private Set<Comment> comments;

	@ManyToOne(fetch = FetchType.LAZY)
	private Grade grade;

	@ManyToOne(fetch = FetchType.LAZY)
	private Student student;

	@Type(JsonType.class)
	@Column(columnDefinition = "jsonb")
	private Data data;

	@Getter
	@Setter
	@AllArgsConstructor
	@NoArgsConstructor
	@Builder
	public static class Data implements Serializable {
		@Serial
		private static final long serialVersionUID = 6365386061637591425L;
		private String eventName;
		private String eventsInSchoolLife;
		private String myAction;
		private String myThought;
		private String shownPower;
		private String strengthGrown;
	}

	private String createdBy;

	private String updatedBy;

	public EventDetailDto toDto() {
	// @formatter:off
    final var dto = new EventDetailDto(
          this.id,
          this.grade.getName(),
          this.detail.getName(),
          this.status.getValue(),
          this.data,
          this.comments
            .stream()
            .filter(comment -> !comment.getIsDeleted())
            .sorted(Comparator.comparing(Comment::getCreatedAt))
            .map(Comment::toDto)
            .toList()
        );
    // @formatter:on

		return dto;
	}

}
