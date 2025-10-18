package com.sitigroup.backend.s3;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Duration;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/uploads")
@RequiredArgsConstructor
@Tag(name = "Uploads", description = "File upload operations")
public class UploadController {

    private final PresignService presignService;

    @PostMapping("/presign")
    @Operation(summary = "Get pre-signed URL", description = "Get pre-signed URL for direct S3 upload")
    public ResponseEntity<Map<String, Object>> presign(@RequestBody PresignRequest req) {
        // Tạo key: ví dụ "events/uuid-banner.png"
        String key = presignService.buildObjectKey(
                (req.getDirectory() == null || req.getDirectory().isBlank()) ? "events" : req.getDirectory(),
                req.getFilename()
        );
        Map<String, Object> result = presignService.presignPut(
                key,
                req.getContentType(),
                Duration.ofMinutes(req.getExpiresMinutes() != null ? req.getExpiresMinutes() : 10)
        );
        return ResponseEntity.ok(result);
    }

    @Data
    public static class PresignRequest {
        private String filename;       // ví dụ: banner.png
        private String contentType;    // ví dụ: image/png
        private String directory;      // ví dụ: events hoặc club
        private Integer expiresMinutes; // default 10
    }
}