package trial.spring.repository

import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository
import trial.spring.model.User

@Repository
interface UserRepository: JpaRepository<User, Int> {
    fun findByName(name: String): User?
}