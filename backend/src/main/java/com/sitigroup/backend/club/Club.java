package com.sitigroup.backend.club;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Document("club")
@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class Club {
    @Id
    private String id; // có thể để null khi insert lần đầu, Mongo sẽ tạo

    private String officialName;    // Tên đầy đủ
    private String shortName;       // SiTiGroup
    private String foundedDate;     // "2009-07-15"
    private String founder;         // "Lê Anh Bảo"
    private String mission;         // mô tả ngắn
    private List<String> featuredImages; // URLs
    private String contactEmail;
    private String contactPhone;
    private String facebookUrl;
    private String website;
}