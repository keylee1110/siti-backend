package com.sitigroup.backend.events;

import com.sitigroup.backend.core.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.Map;

@RestController
@RequestMapping("/api/admin/events")
@RequiredArgsConstructor
@Tag(name = "Admin Events", description = "Admin CRUD operations for events")
public class AdminEventController {

    private final EventRepository repo;

    @GetMapping
    @Operation(summary = "List all events (all statuses) for admin")
    public ApiResponse<Map<String, Object>> listAll(
            @RequestParam(required = false) Event.Status status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "startAt"));
        Page<Event> result;

        if (status != null) {
            result = repo.findByStatus(status, pageable);
        } else {
            result = repo.findAll(pageable);
        }

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
    @Operation(summary = "Get event by ID (admin)")
    public ApiResponse<Event> getById(@PathVariable String id) {
        Event event = repo.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Event not found"));
        return ApiResponse.ok(event);
    }

    @PostMapping
    @Operation(summary = "Create new event")
    public ApiResponse<Event> create(@Valid @RequestBody EventCreateRequest request) {
        Event event = new Event();
        event.setTitle(request.getTitle());
        event.setSummary(request.getSummary());
        event.setDescription(request.getDescription());
        event.setStartAt(request.getStartAt());
        event.setEndAt(request.getEndAt());
        event.setLocation(request.getLocation());
        event.setCoverImage(request.getCoverImage());
        event.setGallery(request.getGallery());
        event.setStatus(request.getStatus() != null ? request.getStatus() : Event.Status.DRAFT);

        Event saved = repo.save(event);
        return ApiResponse.ok(saved);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update existing event")
    public ApiResponse<Event> update(
            @PathVariable String id,
            @Valid @RequestBody EventUpdateRequest request
    ) {
        Event event = repo.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Event not found"));

        if (request.getTitle() != null) event.setTitle(request.getTitle());
        if (request.getSummary() != null) event.setSummary(request.getSummary());
        if (request.getDescription() != null) event.setDescription(request.getDescription());
        if (request.getStartAt() != null) event.setStartAt(request.getStartAt());
        if (request.getEndAt() != null) event.setEndAt(request.getEndAt());
        if (request.getLocation() != null) event.setLocation(request.getLocation());
        if (request.getCoverImage() != null) event.setCoverImage(request.getCoverImage());
        if (request.getGallery() != null) event.setGallery(request.getGallery());
        if (request.getStatus() != null) event.setStatus(request.getStatus());

        Event saved = repo.save(event);
        return ApiResponse.ok(saved);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete event")
    public ApiResponse<Void> delete(@PathVariable String id) {
        if (!repo.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Event not found");
        }
        repo.deleteById(id);
        return ApiResponse.ok(null);
    }
}