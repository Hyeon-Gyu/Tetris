package trial.spring.controller

import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController
import trial.spring.repository.UserRepository

@RestController
class ApiExampleController(
    private var userRepository: UserRepository
) {
    @GetMapping("/ping")
    fun ping(): String {
        return "ping!"
    }

    @PostMapping("/echo")
    fun echo(@RequestParam input: String): String {
        return input
    }

    @GetMapping("/user/{name}")
    fun user(@PathVariable name: String): String {
        return userRepository.findByName(name)
            ?.let { "id: ${it.id} name: ${it.name}" }
            ?: "user not found"
    }
}