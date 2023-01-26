package trial.spring.model

import jakarta.persistence.*

@Entity(name = "user")
data class User (
    @get:Id
    @get:GeneratedValue(strategy = GenerationType.AUTO)
    @get:Column(nullable = false)
    var id: Int,

    @get:Column(length = 28, nullable = false)
    var name: String
)