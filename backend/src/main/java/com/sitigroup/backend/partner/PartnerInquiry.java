package com.sitigroup.backend.partner;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.*;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

@Document("partner_inquiries")
@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class PartnerInquiry {

    public enum Status { NEW, REVIEWING, DONE }

    @Id
    private String id;

    @Indexed(unique = false)
    private String email;

    private String organization;
    private String name;
    private String phone;
    private String message;

    @Builder.Default
    private Status status = Status.NEW;

    @Builder.Default
    @Indexed(direction = IndexDirection.DESCENDING)
    private Instant createdAt = Instant.now();
}
