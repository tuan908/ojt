package com.tuanna.ojt.api.entity;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity(name = "OjtComment")
@Table(name = "ojt_comment")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Comment extends BaseEntity {
    private static final long serialVersionUID = 5581420110882356388L;

	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
	
	@OneToOne
	@JoinColumn(name = "user_id", referencedColumnName = "id")
	private User user;

    private String content;

    private Boolean isDeleted;
    
    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "student_event_id", referencedColumnName = "id")
    private StudentEvent studentEvent;
    
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

}
