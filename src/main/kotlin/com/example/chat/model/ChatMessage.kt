package com.example.chat.model

class ChatMessage {
    var content: String? = null
    var key:String? = null
    var sender: String? = null
    var idxBT: String? = null
//    var tstate: String? = null
//    var type: MessageType? = null
//    var playerBoard:Array<IntArray?>? = null

    enum class MessageType {
        CHAT, LEAVE, JOIN
    }
}