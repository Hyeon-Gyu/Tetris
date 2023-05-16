package com.example.java_pracWebSocket.handler;

import com.example.java_pracWebSocket.model.Message;
import com.example.java_pracWebSocket.model.MsgRoom;
import com.example.java_pracWebSocket.model.RoomManage;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

//소켓 통신은 서버와 클라이언트간 1:N 관계 맺는다
// 서버는 여러 클라이언트가 발송한 메시지를 받아서 처리할 handler가 필요


@Slf4j
@Component
@RequiredArgsConstructor
public class WebSocketHandler extends TextWebSocketHandler {
    private final RoomManage roomManage;
    private final ObjectMapper objectMapper;


    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
        String payload = message.getPayload();
        log.info("payload : {}", payload);
        Message msg = objectMapper.readValue(payload, Message.class);
        log.info("session {}", msg.toString());
        MsgRoom room = roomManage.findRoomByID(msg.getRoomID());
        log.info("room {}", room.toString());
        room.handleActions(session, msg, roomManage);
    }
}
/*
데이터 전송시 datagram 모습
"status":
"from":"localhost",
"to":"http://melonicedlatte.com/chatroom/1",
"method":"GET",
"data":{"message":"There is a cutty dog!"}
이 중에서 payload는 'data'에 해당
*/

//    @Override
//    public void afterConnectionEstablished(WebSocketSession session) throws Exception{
//        session_list.add(session);
//        TextMessage msg = new TextMessage("접속");
//        session.sendMessage(msg);
//        log.info("client 접속");
//    }
//
//    @Override
//    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception{
//        log.info(session + "접속 해제");
//        TextMessage msg = new TextMessage("접속해제");
//        session.sendMessage(msg);
//        session_list.remove(session);
//    }

