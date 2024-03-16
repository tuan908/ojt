package com.tuanna.ojt.api.entity;

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

@Entity(name = "OjtEventComment")
@Table(name = "ojt_event_comment")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EventComment extends BaseEntity {
    private static final long serialVersionUID = 5581420110882356388L;

	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String content;

    private Boolean isDeleted;

    @Override
    public boolean equals(final Object o) {
        if (o == this)
            return true;
        if (!(o instanceof final EventComment eventComment)) {
            return false;
        }
        return this.id != null && this.id.equals(eventComment.getId());
    }

    @Override
    public int hashCode() {
        return this.getClass().hashCode();
    }

}
