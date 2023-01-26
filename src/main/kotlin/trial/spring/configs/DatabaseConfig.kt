package trial.spring.configs

import com.zaxxer.hikari.HikariDataSource
import org.apache.naming.factory.BeanFactory
import org.hibernate.boot.model.TypeContributions
import org.hibernate.boot.model.TypeContributor
import org.hibernate.boot.model.naming.ImplicitNamingStrategyComponentPathImpl
import org.hibernate.service.ServiceRegistry
import org.springframework.boot.autoconfigure.jdbc.DataSourceProperties
import org.springframework.boot.autoconfigure.orm.jpa.HibernateSettings
import org.springframework.boot.context.properties.ConfigurationProperties
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.context.annotation.Primary
import org.springframework.data.jpa.repository.config.EnableJpaRepositories
import org.springframework.orm.jpa.LocalContainerEntityManagerFactoryBean
import org.springframework.orm.jpa.vendor.HibernateJpaVendorAdapter
import javax.sql.DataSource

@Configuration
@EnableJpaRepositories(
    basePackages = ["trial.spring.repository"],
)
class DatabaseConfig(
//    private val beanFactory: BeanFactory
) {
    @Bean
    @Primary
    fun dataSourceProperties(): DataSourceProperties {
        return DataSourceProperties()
    }

    @Bean
    @ConfigurationProperties("spring.datasource.hikari")
    fun dataSource(): DataSource {
        return HikariDataSource()
    }

    @Bean
    @Primary
    fun entityManagerFactory(): LocalContainerEntityManagerFactoryBean {
        val factory = LocalContainerEntityManagerFactoryBean()
        factory.jpaVendorAdapter = HibernateJpaVendorAdapter()
        factory.dataSource = dataSource()
        factory.setPackagesToScan("trial.spring.model")
        factory.jpaPropertyMap.putAll(
            mapOf(
                "hibernate.dialect" to "org.hibernate.dialect.MySQL5Dialect"
            )
        )
        return factory
    }
}