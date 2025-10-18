package com.sitigroup.backend.club;

import com.sitigroup.backend.core.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/club")
@RequiredArgsConstructor
@Tag(name = "Public", description = "Public endpoints")
public class ClubController {
    private final ClubRepository repo;

    @GetMapping
    @Operation(summary = "Get club information", description = "Get information about SiTiGroup club")
    public ApiResponse<Club> get() {
        var club = repo.findAll().stream().findFirst().orElse(null);
        return ApiResponse.ok(club);
    }
}