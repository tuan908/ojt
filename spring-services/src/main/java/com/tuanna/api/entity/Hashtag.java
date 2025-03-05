package com.tuanna.api.entity;

import java.io.Serial;
import java.util.Set;

import org.hibernate.annotations.DialectOverride.SQLRestriction;
import org.hibernate.annotations.NaturalId;
import org.hibernate.annotations.NaturalIdCache;
import org.hibernate.annotations.SQLDelete;

import com.tuanna.api.dto.HashtagDto;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity(name = "Hashtag")
@Table(name = "t_hashtag")
@SQLDelete(sql = "UPDATE t_hashtag SET is_deleted = true WHERE id = ?")
@SQLRestriction(dialect = org.hibernate.dialect.PostgreSQLDialect.class, override = @org.hibernate.annotations.SQLRestriction("is_deleted = false"))
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@NaturalIdCache
public class Hashtag extends BaseEntity {
	@Serial
	private static final long serialVersionUID = -4853544765640403631L;

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(nullable = false, unique = true)
	@NaturalId
	private String name;

	private String color;

	@ManyToMany(fetch = FetchType.LAZY, cascade = { CascadeType.PERSIST, CascadeType.MERGE }, mappedBy = "hashtags")
	private Set<Student> students;

	public HashtagDto toDto() {
		return new HashtagDto(this.getId(), this.getName(), this.getColor());
	}

}
