package com.sitigroup.backend.partner;

import com.sitigroup.backend.core.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.time.Instant;
import java.time.LocalDateTime;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

@RestController
@RequiredArgsConstructor
@Tag(name = "Partner Inquiries", description = "Partner inquiry operations")
public class PartnerInquiryController {

    private final PartnerInquiryRepository repo;

    // Simple rate limiting: Map<IP, List<RequestTime>>
    private final Map<String, List<LocalDateTime>> rateLimitMap = new ConcurrentHashMap<>();
    private static final int MAX_REQUESTS_PER_HOUR = 5;

    @PostMapping("/api/partner-inquiries")
    @Operation(summary = "Submit partner inquiry (public)")
    public ApiResponse<PartnerInquiry> submit(
            @Valid @RequestBody PartnerInquiryRequest request,
            HttpServletRequest httpRequest
    ) {
        String clientIp = getClientIp(httpRequest);
        checkRateLimit(clientIp);

        PartnerInquiry inquiry = new PartnerInquiry();
        inquiry.setOrganization(request.getOrgName());
        inquiry.setEmail(request.getContactEmail());
        inquiry.setMessage(request.getMessage());
        inquiry.setStatus(PartnerInquiry.Status.NEW);
        inquiry.setCreatedAt(Instant.now());


        PartnerInquiry saved = repo.save(inquiry);
        return ApiResponse.ok(saved);
    }

    @GetMapping("/api/admin/partner-inquiries")
    @Operation(summary = "List all partner inquiries (admin)")
    public ApiResponse<Map<String, Object>> listAll(
            @RequestParam(required = false) PartnerInquiry.Status status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<PartnerInquiry> result;

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

    @PutMapping("/api/admin/partner-inquiries/{id}")
    @Operation(summary = "Update inquiry status (admin)")
    public ApiResponse<PartnerInquiry> updateStatus(
            @PathVariable String id,
            @RequestBody Map<String, String> body
    ) {
        PartnerInquiry inquiry = repo.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Inquiry not found"));

        String statusStr = body.get("status");
        if (statusStr != null) {
            try {
                PartnerInquiry.Status newStatus = PartnerInquiry.Status.valueOf(statusStr.toUpperCase());
                inquiry.setStatus(newStatus);
            } catch (IllegalArgumentException e) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid status value");
            }
        }

        PartnerInquiry saved = repo.save(inquiry);
        return ApiResponse.ok(saved);
    }

    private void checkRateLimit(String ip) {
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime oneHourAgo = now.minusHours(1);

        // Clean old entries and get recent requests
        List<LocalDateTime> requests = rateLimitMap.getOrDefault(ip, new ArrayList<>());
        requests.removeIf(time -> time.isBefore(oneHourAgo));

        if (requests.size() >= MAX_REQUESTS_PER_HOUR) {
            throw new ResponseStatusException(HttpStatus.TOO_MANY_REQUESTS,
                    "Rate limit exceeded. Maximum " + MAX_REQUESTS_PER_HOUR + " requests per hour.");
        }

        requests.add(now);
        rateLimitMap.put(ip, requests);
    }

    private String getClientIp(HttpServletRequest request) {
        String ip = request.getHeader("X-Forwarded-For");
        if (ip == null || ip.isEmpty() || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getHeader("X-Real-IP");
        }
        if (ip == null || ip.isEmpty() || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getRemoteAddr();
        }
        // Lấy IP đầu tiên nếu có nhiều
        if (ip != null && ip.contains(",")) {
            ip = ip.split(",")[0].trim();
        }
        return ip;
    }
}