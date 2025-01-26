package com.InteractiveQ.main.model;

import com.InteractiveQ.main.entities.Message;
import com.InteractiveQ.main.entities.PollOption;

import jdk.jfr.Timestamp;
import lombok.*;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class MessageDTO {
    private Message message;
    private List<PollOption> pollOptions;
//    private Boolean isCurrentUser;
}
