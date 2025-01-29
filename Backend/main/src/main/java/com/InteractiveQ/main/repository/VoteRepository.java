package com.InteractiveQ.main.repository;

import com.InteractiveQ.main.entities.PollOption;
import com.InteractiveQ.main.entities.Vote;
import com.InteractiveQ.main.entities.VoteId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VoteRepository extends JpaRepository<Vote, VoteId> {

    List<Vote> findByOption(PollOption option);

}
