package com.example.chat.controller

import com.example.chat.model.CTetris
import com.example.chat.model.ChatMessage
import com.example.chat.model.Tetris
import com.example.chat.model.TetrisState
import com.example.chat.model.blockarray.setOfBlockArrays
import org.springframework.messaging.handler.annotation.MessageMapping
import org.springframework.messaging.handler.annotation.Payload
import org.springframework.messaging.handler.annotation.SendTo
import org.springframework.messaging.simp.SimpMessageHeaderAccessor
import org.springframework.stereotype.Controller
import java.util.*
import kotlin.collections.HashMap



@Controller
class ChatController {
    companion object {
        var clientTetrisMap = HashMap<String?, CTetris>()
    }
    @MessageMapping("/chat.register") //login 창
    @SendTo("/topic/public")
    fun register(@Payload chatMessage: ChatMessage, headerAccessor: SimpMessageHeaderAccessor): ChatMessage {
        headerAccessor.sessionAttributes!!["username"] = chatMessage.sender
        Tetris.init(setOfBlockArrays)
        var board = CTetris(15,10)
        var random = Random()
        var initKey = '0' + random.nextInt(7)
        board.state = board.accept(initKey)
        board.printScreen()
        clientTetrisMap[chatMessage.sender!!] = board //hashmap에 board instance 저장
        print("login by ${chatMessage.sender}")
        println()
        return chatMessage
    }

    @MessageMapping("/chat.send")
    @SendTo("/topic/public")
    fun sendMessage(@Payload chatMessage: ChatMessage): ChatMessage {
        var random = Random()
        var key = chatMessage.key //키값 꺼내오기
        var sender = chatMessage.sender //보낸사람 확인
        print("game running on $sender side")
        println()
        var board = clientTetrisMap[sender] //hash map에서 user name찾아서 board객체 찾아오기
        println("---------User: $sender, Board: $board")
        var state = board!!.state
        println("state: $state")
        when(state){
            TetrisState.Finished -> {
                clientTetrisMap.replace(chatMessage.sender,board)
                //clientTetrisMap[chatMessage.sender!!] = board
                chatMessage.playerBoard = board.oScreen.get_array()
                print(" $sender board game over")
                //chatMessage.content = "gameover" // 게임종료 signal
                return chatMessage
            }
            TetrisState.Running -> {
                if(key == 'q'){
                    board.printScreen()
                    println(board)
                    board.state = TetrisState.Finished
                    clientTetrisMap.replace(chatMessage.sender,board)
                    //clientTetrisMap[chatMessage.sender!!] = board
                    chatMessage.playerBoard = board.oScreen.get_array()
                    return chatMessage
                }
                board.state = board.accept(key!!)
                board.printScreen()
                println(board)
                println()
            }
            TetrisState.NewBlock -> {
                key = ('0' + random.nextInt(7))
                board.state = board.accept(key)
                board.printScreen()
                println()
                if(board.state == TetrisState.Finished){
                    clientTetrisMap.replace(chatMessage.sender,board)
                    //clientTetrisMap[chatMessage.sender!!] = board
                    chatMessage.playerBoard = board.oScreen.get_array()
                    return chatMessage
                }
            }
            else -> {
                clientTetrisMap.replace(chatMessage.sender,board)
                //clientTetrisMap[chatMessage.sender!!] = board
                //chatMessage.content = "wrong key"
                return chatMessage
            }
        }
        //clientTetrisMap.replace(chatMessage.sender,board)
        clientTetrisMap[chatMessage.sender!!] = board
        chatMessage.playerBoard = board.oScreen.get_array()
        //chatMessage.content = "$sender board"
        return chatMessage
    }
}