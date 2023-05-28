package com.example.chat.controller

import org.springframework.web.bind.annotation.*

@RestController
class PingController {

    @RequestMapping("/ping")
    fun handle(): String {
        return "ping!"
    }
    @PostMapping("/echo")
    fun echo(@RequestBody input: String): String {
        return input
    }
}