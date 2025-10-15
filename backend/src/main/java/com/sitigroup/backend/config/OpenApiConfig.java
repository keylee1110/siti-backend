package com.sitigroup.backend.config;

import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.OpenAPI;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {
    @Bean
    public OpenAPI apiInfo() {
        return new OpenAPI().info(new Info()
                .title("SiTi API")
                .description("SiTi Landing Page backend (Spring Boot + MongoDB + S3-compatible)")
                .version("v1"));
    }
}