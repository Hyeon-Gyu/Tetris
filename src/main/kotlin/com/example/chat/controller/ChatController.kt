
package com.example.chat.controller

import com.example.chat.controller.ChatController.Companion.clientTetrisMap
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
        var clientTetrisMap:MutableMap<String, CTetris> = HashMap()
        var oneTimeUseMap:MutableMap<String, String> = HashMap()
    }

    @MessageMapping("/chat.register") //login 창

    @SendTo("/topic/prevuser")
    fun register(@Payload chatMessage: ChatMessage, headerAccessor: SimpMessageHeaderAccessor): ChatMessage {
        headerAccessor.sessionAttributes!!["username"] = chatMessage.sender
        Tetris.init(setOfBlockArrays)
        var board = CTetris(15,10)
        board.state = TetrisState.NewBlock
        var initKey= chatMessage.idxBT
        println("random num is $initKey")
        board.state = board.accept(initKey!!)
        board.printScreen()
        oneTimeUseMap[chatMessage.sender!!] = initKey //초기 생성 랜덤 숫자를 저장, ctetris 객체를 저장하지말고
        clientTetrisMap[chatMessage.sender!!] = board //hashmap에 board instance 저장

        chatMessage.oneTimeUseMap = oneTimeUseMap

        return chatMessage
    }

    @MessageMapping("/chat.send")
    @SendTo("/topic/public")
    fun sendMessage(@Payload chatMessage: ChatMessage): ChatMessage {
        var sender = chatMessage.sender //보낸사람 확인
        print("game running on $sender side")
        println()
        print("key:${chatMessage.key}")
        println()
        var board = clientTetrisMap[sender] //hash map에서 user name찾아서 board객체 찾아오기

        when(board!!.state){
            TetrisState.Finished -> {
                print(" $sender board game over")
                clientTetrisMap[chatMessage.sender!!] = board
                chatMessage.alert = "finished"
                return chatMessage
            }
            TetrisState.Running -> {
                if(chatMessage.key == "q"){
                    return handleQuit(board,chatMessage)
                }
                else{
                    return handleRunning(board,chatMessage)
                }
            }
            TetrisState.NewBlock -> {
                chatMessage.resetGame = setReset()
                return handleNewBlock(board,chatMessage)
            }
            else -> {
                println("wrong key")
                chatMessage.content = "wrong key"
                return chatMessage
            }
        }

    }

}
fun setReset():Boolean{
    var board = clientTetrisMap["aaa"]//테스트용

    return board!!.state==TetrisState.Finished
}
private fun handleQuit(board:CTetris,chatMessage: ChatMessage): ChatMessage {
    board.printScreen()
    println("current board id: $board")
    board.state = TetrisState.Finished
    chatMessage.alert = "game quit"
    clientTetrisMap[chatMessage.sender!!] = board
    println(chatMessage)
    /** chatmessage 구조
     * content : 'q'
     * key : 'q'
     * sender: 'q'를 입력한 사용자
     * idxBT : NULL
     * alert : "game quit" */
    chatMessage.resetGame = setReset()
    return chatMessage
}

private fun handleRunning(board:CTetris, chatMessage: ChatMessage): ChatMessage {
    board.state = board.accept(chatMessage.key!!)
    board.printScreen()
    if (chatMessage.idxBT != null && board.state == TetrisState.NewBlock) { //newblock일때 동작
        return handleNewBlock(board, chatMessage)
    }
    clientTetrisMap[chatMessage.sender!!] = board
    chatMessage.resetGame = setReset()
    return chatMessage
}

fun handleNewBlock(board: CTetris,chatMessage: ChatMessage):ChatMessage{
    board.state = board.accept(chatMessage.idxBT!!)
    board.printScreen()
    println()
    if(board.state == TetrisState.Finished){
        chatMessage.alert = "finished"
        clientTetrisMap[chatMessage.sender!!] = board
        chatMessage.resetGame = setReset()
        return chatMessage
    }
    clientTetrisMap[chatMessage.sender!!] = board
    chatMessage.resetGame = setReset()
    return chatMessage
}