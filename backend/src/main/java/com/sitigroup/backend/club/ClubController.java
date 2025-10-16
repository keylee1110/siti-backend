package com.sitigroup.backend.club;

import com.sitigroup.backend.core.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/club")
@RequiredArgsConstructor
public class ClubController {
    private final ClubRepository repo;

    @GetMapping
    public ApiResponse<Club> get() {
        var club = repo.findAll().stream().findFirst().orElse(null);
        return ApiResponse.ok(club);
    }
}
