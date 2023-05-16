package com.example.java_pracWebSocket.controller;

import com.example.java_pracWebSocket.model.MsgRoom;
import com.example.java_pracWebSocket.model.RoomManage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/chat")
public class MsgController {
    private final RoomManage roomManage;

    @PostMapping
    public MsgRoom createRoom(@RequestParam String roomName){
        return roomManage.createRoom(roomName);
    }
}
