package com.example.java_pracWebSocket.model;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.annotation.PostConstruct;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;

import java.io.IOException;
import java.util.*;

@Slf4j
@Service
@Data
@RequiredArgsConstructor
public class RoomManage {
    private final ObjectMapper objectMapper; //자바객체를 json으로 자동으로 직렬화
    private Map<String,MsgRoom> msgRooms;

    @PostConstruct
    private void init(){
        msgRooms = new LinkedHashMap<>();
    }  //map에 입력된 순서를 기억하는 자료구조

    public List<MsgRoom> findAllRoom(){
        return new ArrayList<>(msgRooms.values());
    }

    public MsgRoom findRoomByID(String roomID){
        return msgRooms.get(roomID);
    } //id가 없을때 동작 기능 추가해야함

    public MsgRoom createRoom(String roomName){
        int randNum = new Random().nextInt(9000000)+1000000;
        String roomID = String.valueOf(randNum);
        MsgRoom room = MsgRoom.builder().roomID(roomID).roomName(roomName).build();
        msgRooms.put(roomID, room);
        log.info("room created!");
        return room;
    }

    public <T> void sendMessage(WebSocketSession session, T message) {
        try {
            session.sendMessage(new TextMessage(objectMapper.writeValueAsString(message)));
            //json 형태의 message를 문자열 또는 바이트배열로 바꾸서 전송
        } catch (IOException e) {
            log.error(e.getMessage(), e);
        }
    }
}
