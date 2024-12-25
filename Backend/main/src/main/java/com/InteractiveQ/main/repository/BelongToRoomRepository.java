package com.InteractiveQ.main.repository;

import com.InteractiveQ.main.entities.BelongToRoom;
import com.InteractiveQ.main.entities.BelongToRoomId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BelongToRoomRepository extends JpaRepository<BelongToRoom, BelongToRoomId> {
}
