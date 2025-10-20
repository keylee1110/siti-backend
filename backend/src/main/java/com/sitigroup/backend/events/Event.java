package com.sitigroup.backend.events;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.*;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;
import java.util.List;

@Document("events")
@Data @Builder @NoArgsConstructor @AllArgsConstructor
@CompoundIndexes({
        @CompoundIndex(name = "status_start_idx", def = "{'status': 1, 'startAt': -1}")
})
public class Event {

    public enum Status { DRAFT, PUBLISHED, ARCHIVED }

    @Id
    private String id;

    private String title;

    private String summary;
    private String description;

    private Status status;

    @Indexed(direction = IndexDirection.DESCENDING)
    private Instant startAt;
    private Instant endAt;

    private String coverImage;       // S3 public URL
    private String posterImage;      // S3 public URL
    private List<String> gallery;    // S3 public URLs

    private Location location;

    @Builder.Default
    @Indexed(direction = IndexDirection.DESCENDING)
    private Instant createdAt = Instant.now();

    private Instant updatedAt;

    @Data @NoArgsConstructor @AllArgsConstructor
    public static class Location {
        private String name;
        private Double lat;
        private Double lng;
    }
}