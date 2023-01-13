package trial.spring.controller

import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
class PingController {
    @RequestMapping("ping")
    fun handle(): String {
        return "ping!"
    }
}