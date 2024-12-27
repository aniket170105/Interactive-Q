package com.InteractiveQ.main.service.message;


import com.InteractiveQ.main.entities.Message;
import com.InteractiveQ.main.entities.PollOption;
import com.InteractiveQ.main.entities.Room;
import com.InteractiveQ.main.model.MessageDTO;
import com.InteractiveQ.main.repository.MessageRepository;
import com.InteractiveQ.main.repository.PollOptionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

/*
Please note that before calling this service, Room and Message.room_id should be same
and also user which is querying this service should also be from same room
and should be authenticated and not exited
*/

@Service
public class MessageService {
    @Autowired
    MessageRepository messageRepository;
    @Autowired
    PollOptionRepository pollOptionRepository;

//    This function will save a message in the database. Before calling this note that above
//    criteria is fullfilled
    public MessageDTO saveMessage(Message message, List<PollOption> pollOptionList){
        Message savedMessage = messageRepository.save(message);
        MessageDTO requiredMessage = new MessageDTO();
        List <PollOption> savedPoll = new ArrayList<>();

        if(savedMessage.getIsPoll().equals(Boolean.TRUE)){
            for(PollOption temp : pollOptionList){
                temp.setMessage(savedMessage);
                savedPoll.add(pollOptionRepository.save(temp));
            }
        }
        requiredMessage.setMessage(savedMessage);
        requiredMessage.setPollOptions(savedPoll);
        return requiredMessage;
    }

//    This function is used to return all the message belonging to a room
    public List<MessageDTO> fetchMessagesWithPolls(Room room) {
//        Return the list in sorted order
        List<Message> messages = messageRepository.findByRoom(room, Sort.by("postTime").descending());
        List<MessageDTO> result = new ArrayList<>();
        for (Message message : messages) {
            MessageDTO messageDTO = new MessageDTO();
            messageDTO.setMessage(message);
            if (Boolean.TRUE.equals(message.getIsPoll())) {
                List<PollOption> pollOptions = pollOptionRepository.findByMessage(message);
                messageDTO.setPollOptions(pollOptions);
            }
            result.add(messageDTO);
        }
        return result;
    }



}
