package com.InteractiveQ.main.controller;


import com.InteractiveQ.main.entities.Message;
import com.InteractiveQ.main.entities.Person;
import com.InteractiveQ.main.entities.PollOption;
import com.InteractiveQ.main.entities.Room;
import com.InteractiveQ.main.model.MessageDTO;
import com.InteractiveQ.main.request.message.RequestAllMessagesDTO;
import com.InteractiveQ.main.request.message.RequestMessageDTO;
import com.InteractiveQ.main.request.message.RequestPollDTO;
import com.InteractiveQ.main.request.message.RequestPollOptionDTO;
import com.InteractiveQ.main.service.JwtService;
import com.InteractiveQ.main.service.PersonService;
import com.InteractiveQ.main.service.RoomService;
import com.InteractiveQ.main.service.message.LikeService;
import com.InteractiveQ.main.service.message.MessageService;
import com.InteractiveQ.main.service.message.PollService;
import com.InteractiveQ.main.service.message.VoteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
public class MessageController {

    @Autowired
    MessageService messageService;
    @Autowired
    LikeService likeService;
    @Autowired
    PollService pollService;
    @Autowired
    VoteService voteService;
    @Autowired
    PersonService personService;
    @Autowired
    JwtService jwtService;
    @Autowired
    RoomService roomService;

    @PostMapping("user/room/message/send")
    public ResponseEntity<String> sendMessage(
            @RequestHeader(value = HttpHeaders.AUTHORIZATION, required = true) String authHeader,
            @RequestBody RequestMessageDTO messageDTO
            ){
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Fuck Offff");
        }
        String token = authHeader.substring(7);
        String username = jwtService.extractUsername(token);
        Optional<Person> user = personService.userProfile(username);
        Optional<Room> room = roomService.getRoom(messageDTO.getRoomId());
        if(user.isPresent() && room.isPresent() && messageService.isUserBelongToRoom(username, messageDTO.getRoomId())){

            if(room.get().getIsEnded()){
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Room Already Ended");
            }

            Message message = new Message();
            message.setTaggedMessage(messageDTO.getTaggedMessage());
            message.setRoom(room.get());
            message.setText(messageDTO.getText());
            message.setUser(user.get());
            message.setIsAnonymous(messageDTO.getIsAnonymous());
            message.setIsPoll(messageDTO.getIsPoll());
            messageService.saveMessage(message, null);
            return ResponseEntity.status(HttpStatus.OK).body("Message Successfully Posted");
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Error Occurred : User might not be authorized to send messages yet");
    }

    @PostMapping("user/room/poll/send")
    public ResponseEntity<String> sendPoll(
            @RequestHeader(value = HttpHeaders.AUTHORIZATION, required = true) String authHeader,
            @RequestBody RequestPollDTO requestPollDTO
            ){
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Fuck Offff");
        }
        String token = authHeader.substring(7);
        String username = jwtService.extractUsername(token);
        Optional<Person> user = personService.userProfile(username);
        Optional<Room> room = roomService.getRoom(requestPollDTO.getRoomId());
        if(user.isPresent() && room.isPresent() && messageService.isUserBelongToRoom(username, requestPollDTO.getRoomId())){

            if(room.get().getIsEnded()){
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Room Already Ended");
            }

            Message message = new Message();
            message.setTaggedMessage(requestPollDTO.getTaggedMessage());
            message.setRoom(room.get());
            message.setText(requestPollDTO.getText());
            message.setUser(user.get());
            message.setIsAnonymous(requestPollDTO.getIsAnonymous());
            message.setIsPoll(requestPollDTO.getIsPoll());
            List <PollOption> pollOptions = new ArrayList<>();
            for(String requestPollOptionDTO : requestPollDTO.getPollOptions()){
                PollOption pollOption = new PollOption();
                pollOption.setOptText(requestPollOptionDTO);
                pollOptions.add(pollOption);
            }
            messageService.saveMessage(message, pollOptions);
            return ResponseEntity.status(HttpStatus.OK).body("Poll Successfully Posted");
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Error Occurred : User might not be authorized to send messages yet");
//        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Error Occurred while Saving Poll");
    }

    @PostMapping("user/room/getMessages")
    public ResponseEntity<List<MessageDTO>> getAllMessages(
            @RequestHeader(value = HttpHeaders.AUTHORIZATION, required = true) String authHeader,
            @RequestBody RequestAllMessagesDTO requestAllMessagesDTO
            ) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(null);
        }
        String token = authHeader.substring(7);
        String username = jwtService.extractUsername(token);
        Optional<Person> user = personService.userProfile(username);
        Optional<Room> room = roomService.getRoom(requestAllMessagesDTO.getRoomId());
        if (user.isPresent() && room.isPresent() && messageService.isUserBelongToRoom(username, requestAllMessagesDTO.getRoomId())) {
            return ResponseEntity.status(HttpStatus.OK).body(messageService.fetchMessagesWithPolls(room.get(), user.get()));
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
    }

    @PatchMapping("user/room/poll/vote")
    public ResponseEntity<String> likeMessage(
            @RequestHeader(value = HttpHeaders.AUTHORIZATION, required = true) String authHeader,
            @RequestBody Map<String, Integer> request
    ){
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Not Authorized");
        }
        String token = authHeader.substring(7);
        String username = jwtService.extractUsername(token);
        Optional<Person> user = personService.userProfile(username);
        Optional<PollOption> pollOption = pollService.getPollOptionById(request.get("optId"));
        if(user.isPresent() && pollOption.isPresent() &&
            messageService.isMessageBelongToSameRoomAsUser(pollOption.get().getMessage().getMessageId(), username)
        ){
            voteService.voteInPoll(user.get(), pollOption.get());
            return ResponseEntity.status(HttpStatus.OK).body("Voted Successfully");
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Error Occurred");
    }
}
