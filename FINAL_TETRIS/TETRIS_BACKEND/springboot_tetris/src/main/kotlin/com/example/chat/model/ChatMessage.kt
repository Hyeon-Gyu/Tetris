package com.example.chat.model

import lombok.Getter
import lombok.Setter


@Getter
@Setter
class ChatMessage {
    var content: String? = null
    var key:String? = null
    var sender: String? = null
    var idxBT: String? = null
    var alert:String? = null

    var oneTimeUseMap:MutableMap<String,String>? = null
    var readyOrStart: String? = null

    var resetGame:Boolean = false
    var resetCount:Int=0


    enum class MessageType {
        CHAT, LEAVE, JOIN
    }
}