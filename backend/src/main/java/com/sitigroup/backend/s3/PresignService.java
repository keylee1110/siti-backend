package com.sitigroup.backend.s3;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import software.amazon.awssdk.services.s3.presigner.S3Presigner;
import software.amazon.awssdk.services.s3.presigner.model.PresignedPutObjectRequest;
import software.amazon.awssdk.services.s3.presigner.model.PutObjectPresignRequest;

import java.net.URL;
import java.time.Duration;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PresignService {

    private final S3Presigner presigner;

    @Value("${app.s3.bucket}")
    private String bucket;

    @Value("${app.s3.public-base-url}")
    private String publicBaseUrl;

    /** Tạo key an toàn dạng prefix/yyyyMMdd/uuid-filename */
    public String buildObjectKey(String prefix, String filename) {
        String safePrefix = (prefix == null || prefix.isBlank()) ? "uploads" : prefix.replaceAll("[^a-zA-Z0-9/_-]", "_");
        String safeName = (filename == null || filename.isBlank()) ? "file" : filename.replaceAll("[^a-zA-Z0-9._-]", "_");
        return String.format("%s/%s-%s", safePrefix, UUID.randomUUID(), safeName);
    }

    public Map<String, Object> presignPut(String key, String contentType, Duration expires) {
        PutObjectRequest put = PutObjectRequest.builder()
                .bucket(bucket)
                .key(key)
                .contentType(contentType != null ? contentType : "application/octet-stream")
                .build();

        PutObjectPresignRequest presign = PutObjectPresignRequest.builder()
                .signatureDuration(expires != null ? expires : Duration.ofMinutes(10))
                .putObjectRequest(put)
                .build();

        PresignedPutObjectRequest req = presigner.presignPutObject(presign);
        URL url = req.url();

        // Nơi FE có thể load public sau khi upload xong
        String publicUrl = (publicBaseUrl != null && !publicBaseUrl.isBlank())
                ? (publicBaseUrl.endsWith("/") ? publicBaseUrl + key : publicBaseUrl + "/" + key)
                : null;

        return Map.of(
                "url", url.toString(),
                "method", "PUT",
                "headers", req.signedHeaders(),
                "key", key,
                "bucket", bucket,
                "publicUrl", publicUrl,
                "expiresInSec", (expires != null ? expires.getSeconds() : 600)
        );
    }
}
