package com.example.java_pracWebSocket.model;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class Message {
    public enum MessageType{
        ENTER,
        TALK
    }
    private MessageType messageType;
    private String roomID;
    private String sender;
    private String message;
}

//{
//        "messageType":"ENTER",
//        "roomID":"1",
//        "sender":"lim",
//        "message":""
//}