
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


@Controller
class ChatController {

    companion object{

        var random = Random()
        var clientTetrisMap:MutableMap<String, CTetris> = HashMap() //ctetris import
    }

    @MessageMapping("/chat.register") //login 창
    @SendTo("/topic/public")
    fun register(@Payload chatMessage: ChatMessage, headerAccessor: SimpMessageHeaderAccessor): ChatMessage {
        headerAccessor.sessionAttributes!!["username"] = chatMessage.sender
        Tetris.init(setOfBlockArrays)
        var board = CTetris(15,10)
        board.state = TetrisState.NewBlock
//        var initKey = '0' + random.nextInt(7)
        var initKey= chatMessage.idxBT
        println("random num is $initKey")
        board.state = board.accept(initKey!!)
        board.printScreen()
        clientTetrisMap[chatMessage.sender!!] = board //hashmap에 board instance 저장
        //print("login by ${chatMessage.sender}")
        //println()
//        println("Contents of clientTetrisMap:")
//        for ((user, board) in clientTetrisMap) {
//            println("User: $user, Board: $board")
//        }

        return chatMessage
    }

    @MessageMapping("/chat.send")
    @SendTo("/topic/public")
    fun sendMessage(@Payload chatMessage: ChatMessage): ChatMessage {
        var key = chatMessage.key //키값 꺼내오기
        var sender = chatMessage.sender //보낸사람 확인
        print("game running on $sender side")
        println()
        print("key:${chatMessage.key}")
        println()
        var board = clientTetrisMap[sender] //hash map에서 user name찾아서 board객체 찾아오기

        println("User: $sender, Board: $board")

        var state = board!!.state
        println("현재 state: ${board!!.state}")
        when(state){
            TetrisState.Finished -> {
//                chatMessage.playerBoard = board.oScreen.get_array()
                print(" $sender board game over")
                clientTetrisMap[chatMessage.sender!!] = board
                return chatMessage
            }
            TetrisState.Running -> {
                if(key == "q"){

                    board.printScreen()
                    println("boad idcheck$board:")

                    board.state = TetrisState.Finished
//                    chatMessage.playerBoard = board.oScreen.get_array()
                    clientTetrisMap[chatMessage.sender!!] = board
                    return chatMessage
                }

                println("board id test: $board")
                board.state = board.accept(key!!)
                println("다음 state : ${board.state}")
                board.printScreen()
                println()
                if(chatMessage.idxBT != null && board.state == TetrisState.NewBlock){
                    //_ 날아오면 곧장 newblock 로직을 실행해줘야함. "_"와 같은 message에 함께 randnum 날아옴
                    board.state = board.accept(chatMessage.idxBT!!)
                    board.printScreen()
                    println()
                    if(board.state == TetrisState.Finished){
                        clientTetrisMap[chatMessage.sender!!] = board
                        return chatMessage
                    }
                }
            }
            TetrisState.NewBlock -> {
//                key = chatMessage.key.toString()
//                board.state = board.accept(key!!)
                board.state = board.accept(chatMessage.idxBT!!)
                board.printScreen()
                println()
                if(board.state == TetrisState.Finished){
//                    chatMessage.playerBoard = board.oScreen.get_array()
                    clientTetrisMap[chatMessage.sender!!] = board
                    return chatMessage
                }
            }
            else -> {
                chatMessage.content = "wrong key"
                return chatMessage
            }
        }
//        chatMessage.playerBoard = board.oScreen.get_array()
        clientTetrisMap[chatMessage.sender!!] = board
        return chatMessage
    }
}