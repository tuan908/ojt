package com.tuanna.ojt.api.entity;

import org.hibernate.annotations.NaturalId;
import org.hibernate.annotations.NaturalIdCache;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity(name = "OjtHashtag")
@Table(name = "ojt_hashtag")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@NaturalIdCache
public class Hashtag extends BaseEntity {
  private static final long serialVersionUID = -4853544765640403631L;

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(nullable = false, unique = true)
  @NaturalId
  private String name;

  private String color;

}
