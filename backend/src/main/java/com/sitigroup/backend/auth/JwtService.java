
package com.sitigroup.backend.auth;

import io.jsonwebtoken.*;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.Date;
import java.util.Map;
import java.util.UUID;

@Service
public class JwtService {
    private final SecretKey key;
    private final long expirationMs;

    public JwtService(
            @Value("${app.jwt.secret}") String secretBase64,
            @Value("${app.jwt.expires-ms}") long expirationMs
    ) {
        if (secretBase64 == null || secretBase64.isBlank()) {
            throw new IllegalStateException("JWT secret is missing. Set env JWT_SECRET (Base64).");
        }
        byte[] keyBytes;
        try {
            // Ưu tiên Base64 (an toàn, chiều dài chuẩn)
            keyBytes = Decoders.BASE64.decode(secretBase64);
        } catch (Exception e) {  // Catch tất cả Exception, không chỉ IllegalArgumentException
            // Fallback: nếu ai đó set chuỗi thường không-base64, vẫn cho chạy nếu đủ ≥ 32 bytes
            byte[] raw = secretBase64.getBytes(StandardCharsets.UTF_8);
            if (raw.length < 32) {
                throw new IllegalStateException("JWT secret too short (<32 bytes). Provide Base64 32+ bytes or plain text ≥32 chars.");
            }
            keyBytes = raw;
        }
        this.key = Keys.hmacShaKeyFor(keyBytes);
        this.expirationMs = expirationMs;
    }

    public String generate(String subject, String email, String role) {
        Instant now = Instant.now();
        return Jwts.builder()
                .setSubject(subject)
                .addClaims(Map.of("email", email, "role", role))
                .setId(UUID.randomUUID().toString())
                .setIssuedAt(Date.from(now))
                .setExpiration(Date.from(now.plusSeconds(expirationMs)))
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }

    public Jws<Claims> parse(String token) {
        return Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(token);
    }
}