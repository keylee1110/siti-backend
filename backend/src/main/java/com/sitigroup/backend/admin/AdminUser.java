package com.sitigroup.backend.admin;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

@Document("admin_users")
@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class AdminUser {
    @Id
    private String id;

    @Indexed(unique = true)
    private String email;

    private String displayName;

    // Sẽ lưu password dạng hash (BCrypt) khi làm auth
    private String passwordHash;

    // Optional: role
    @Builder.Default
    private String role = "ADMIN";

}
