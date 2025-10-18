
package com.sitigroup.backend.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.servers.Server;
import io.swagger.v3.oas.models.tags.Tag;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("SiTiGroup Backend API")
                        .version("1.0.0")
                        .description("Backend API for SiTiGroup landing page and admin panel")
                        .contact(new Contact()
                                .name("SiTiGroup Dev Team")
                                .email("dev@sitigroup.com")))
                .servers(List.of(
                        new Server().url("http://localhost:8080").description("Local Development"),
                        new Server().url("https://api.sitigroup.com").description("Production")
                ))
                .tags(List.of(
                        new Tag().name("Public").description("Public endpoints (no authentication required)"),
                        new Tag().name("Auth").description("Authentication endpoints"),
                        new Tag().name("Admin Events").description("Admin CRUD operations for events"),
                        new Tag().name("Partner Inquiries").description("Partner inquiry operations"),
                        new Tag().name("Uploads").description("File upload operations (S3 pre-signed URLs)")
                ));
    }
}