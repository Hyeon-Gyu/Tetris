package com.example.chat.model

class ChatMessage {
    var content: String? = null
    var key:String? = null
    var sender: String? = null
    var idxBT: String? = null
    var alert:String? = null

    var oneTimeUseMap:MutableMap<String,String>? = null
    var peoplecount: String? = null


    enum class MessageType {
        CHAT, LEAVE, JOIN
    }
}