package com.example.chat.model

class ChatMessage {
    var content: String? = null
    var key:Char? = null
    var sender: String? = null
    var type: MessageType? = null
    var playerBoard:Array<IntArray?>? = null

    enum class MessageType {
        CHAT, LEAVE, JOIN
    }
}