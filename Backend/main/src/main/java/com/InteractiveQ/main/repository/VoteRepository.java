package com.InteractiveQ.main.repository;

import com.InteractiveQ.main.entities.Vote;
import com.InteractiveQ.main.entities.VoteId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface VoteRepository extends JpaRepository<Vote, VoteId> {
}
