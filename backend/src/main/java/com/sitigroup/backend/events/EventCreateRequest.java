package com.sitigroup.backend.events;

import jakarta.validation.constraints.*;
import lombok.Data;

import java.time.Instant;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class EventCreateRequest {
    @NotBlank(message = "Title is required")
    @Size(max = 200, message = "Title must not exceed 200 characters")
    private String title;

    @Size(max = 500, message = "Summary must not exceed 500 characters")
    private String summary;

    private String description;

    @NotNull(message = "Start date is required")
    private Instant startAt;

    private Instant endAt;

    private Event.Location location;

    private String coverImage;

    private List<String> gallery;

    private Event.Status status;
}