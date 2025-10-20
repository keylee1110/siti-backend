package com.sitigroup.backend.events;

import com.sitigroup.backend.core.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.Map;

@RestController
@RequestMapping("/api/events")
@RequiredArgsConstructor
@Tag(name = "Public", description = "Public endpoints")
public class EventController {
    private final EventRepository repo;

    @GetMapping
    @Operation(summary = "List published events", description = "Get paginated list of published events")
    public ApiResponse<Map<String, Object>> list(
            @RequestParam(defaultValue = "PUBLISHED") Event.Status status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        var pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "startAt"));
        var result = repo.findByStatus(status, pageable);
        Map<String, Object> payload = Map.of(
                "content", result.getContent(),
                "page", result.getNumber(),
                "size", result.getSize(),
                "totalElements", result.getTotalElements(),
                "totalPages", result.getTotalPages()
        );
        return ApiResponse.ok(payload);
    }

    @GetMapping("/search")
    @Operation(summary = "Search for events", description = "Search for events by title, summary, and description")
    public ApiResponse<Map<String, Object>> search(
            @RequestParam String query,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        var pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "startAt"));
        var result = repo.searchByText(query, pageable);
        Map<String, Object> payload = Map.of(
                "content", result.getContent(),
                "page", result.getNumber(),
                "size", result.getSize(),
                "totalElements", result.getTotalElements(),
                "totalPages", result.getTotalPages()
        );
        return ApiResponse.ok(payload);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get event details", description = "Get detailed information about a specific event")
    public ApiResponse<Event> get(@PathVariable String id) {
        var e = repo.findById(id).orElseThrow(() ->
                new ResponseStatusException(HttpStatus.NOT_FOUND, "Event not found"));
        return ApiResponse.ok(e);
    }
}