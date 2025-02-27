package com.tuanna.api.entity;

import java.io.Serial;
import java.util.Comparator;
import java.util.Set;

import com.tuanna.api.dto.StudentEventDto;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity(name = "Student")
@Table(name = "t_student")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Student extends BaseEntity {

    @Serial
    private static final long serialVersionUID = -6397969402551800433L;

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(columnDefinition = "text")
	private String code;

	@ManyToMany(fetch = FetchType.LAZY, cascade = { CascadeType.PERSIST, CascadeType.MERGE })
	// @formatter:off
  @JoinTable(
      name = "t_student_hashtag",
      joinColumns = @JoinColumn(name = "student_id"),
      inverseJoinColumns = @JoinColumn(name = "hashtag_id")
    )
  // @formatter:on
	@Builder.Default
	private Set<Hashtag> hashtags = new java.util.HashSet<>();

	@OneToMany(cascade = CascadeType.ALL, orphanRemoval = true, mappedBy = "student")
	@Builder.Default
	private java.util.Set<EventDetail> events = new java.util.HashSet<>();

	@OneToOne(cascade = CascadeType.ALL)
	@JoinColumn(name = "user_id", referencedColumnName = "id")
	private User user;

	@ManyToOne(fetch = FetchType.LAZY)
	private Grade grade;

	@Override
	public boolean equals(final Object o) {
		if (o == this)
			return true;
		if (!(o instanceof final Student student)) {
			return false;
		}
		return this.id != null && this.id.equals(student.getId());
	}

	@Override
	public int hashCode() {
		return this.getClass().hashCode();
	}

	/** Convert to dto from entity */
	public StudentEventDto toDto() {
		var events = this.getEvents().stream().sorted(Comparator.comparing(event -> event.getDetail().getName()))
				.map(event -> event.getDetail().getName()).toList();
		var hashtags = this.getHashtags().stream().sorted(Comparator.comparing(Hashtag::getName)).map(Hashtag::toDto)
				.toList();

		return new StudentEventDto(this.id, this.code, this.user.getName(), this.grade.getName(),
				String.join(", ", events), hashtags);
	}

	public void addHashtag(Hashtag hashtag) {
		this.hashtags.add(hashtag);
		hashtag.getStudents().add(this);
	}

	public void removeHashtag(Long hashtagId) {
		var hashtag = this.hashtags.stream().filter(t -> t.getId() == hashtagId).findFirst().orElse(null);
		if (hashtag != null) {
			this.hashtags.remove(hashtag);
			hashtag.getStudents().remove(this);
		}
	}
}
