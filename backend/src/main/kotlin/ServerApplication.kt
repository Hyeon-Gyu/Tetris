import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.context.annotation.ComponentScan
import org.springframework.context.annotation.PropertySource
@SpringBootApplication
@ComponentScan("trial.spring")
@PropertySource("classpath:application.yml")
class ServerApplication