package com.example.chat.model

class ChatMessage {
    var content: String? = null
    var key:String? = null
    var sender: String? = null
    var idxBT: String? = null
    var alert:String? = null
//    var type:String? = null

    enum class MessageType {
        CHAT, LEAVE, JOIN
    }
}