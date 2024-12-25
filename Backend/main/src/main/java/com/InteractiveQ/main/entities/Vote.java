package com.InteractiveQ.main.entities;

import lombok.*;
import jakarta.persistence.*;


@Entity
@Table(name = "vote")
@IdClass(VoteId.class)
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class Vote {
    @Id
    @Column(name = "user_id")
    private String userId;

    @Id
    @Column(name = "opt_id")
    private Integer optId;

    @ManyToOne
    @JoinColumn(name = "user_id", referencedColumnName = "user_id", insertable = false, updatable = false)
    private Person person;


    @ManyToOne
    @JoinColumn(name = "opt_id", referencedColumnName = "opt_id", insertable = false, updatable = false)
    private PollOption option;

    // Getters and Setters
}
