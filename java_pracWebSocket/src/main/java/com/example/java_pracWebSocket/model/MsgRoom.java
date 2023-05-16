package com.example.java_pracWebSocket.model;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import org.springframework.web.socket.WebSocketSession;

import java.util.HashSet;
import java.util.Set;

@Getter
@Setter
public class MsgRoom {
    private String roomID;
    private String roomName;
    private Set<WebSocketSession> sessions = new HashSet<>();

    @Builder
    public MsgRoom(String roomID, String roomName){
        this.roomID = roomID;
        this.roomName = roomName;
    }

    public void handleActions(WebSocketSession session,Message message, RoomManage roomManage){
        if(message.getMessageType().equals(Message.MessageType.ENTER)){
            sessions.add(session);
            message.setMessage(message.getSender() + "님 입장");
            sendMessage(message, roomManage);
        }
        else if(message.getMessageType().equals(Message.MessageType.TALK)){
            message.setMessage(message.getMessage());
            sendMessage(message, roomManage);
        }
    }

    public <T> void sendMessage(T message, RoomManage roomManage){
        sessions.parallelStream().forEach(session -> roomManage.sendMessage(session,message));
    }

}

/*{
	"messageType":"ENTER",
	"roomID":"4208884",
	"sender":"kwon1",
	"message":""
}


{
	"MessageType:TALK",
	"roomID":"1",
	"sender:"lim",
	"message":"msg from lim"
}	*/
