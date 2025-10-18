package com.sitigroup.backend.auth;

import com.sitigroup.backend.admin.AdminUser;
import com.sitigroup.backend.admin.AdminUserRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.security.SecureRandom;
import java.util.Base64;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Tag(name = "Auth", description = "Authentication endpoints")
public class AuthController {
    private final AdminUserRepository repo;
    private final JwtService jwt;
    private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

    @PostMapping("/login")
    @Operation(summary = "Admin login", description = "Login and receive JWT token in httpOnly cookie")
    public ResponseEntity<?> login(@RequestBody Map<String, String> body, HttpServletResponse res) {
        String email = body.get("email");
        String password = body.get("password");
        AdminUser user = repo.findByEmail(email).orElseThrow(() -> new RuntimeException("Invalid credentials"));
        if (!encoder.matches(password, user.getPasswordHash())) throw new RuntimeException("Invalid credentials");

        String token = jwt.generate(user.getId(), user.getEmail(), user.getRole());
        String csrf = genCsrf();

        // Set cookie via header to ensure SameSite=None works everywhere
        res.addHeader("Set-Cookie", "siti_token=" + token + "; Path=/; HttpOnly; Secure; SameSite=None");
        res.addHeader("Set-Cookie", "siti_csrf=" + csrf  + "; Path=/; Secure; SameSite=None");
        res.setHeader("X-CSRF-Token", csrf);

        return ResponseEntity.ok(Map.of(
                "message", "login ok",
                "csrf", csrf,
                "email", user.getEmail(),
                "role", user.getRole()
        ));
    }

    @PostMapping("/logout")
    @Operation(summary = "Admin logout", description = "Clear authentication cookies")
    public ResponseEntity<?> logout(HttpServletResponse res) {
        res.addHeader("Set-Cookie", "siti_token=; Path=/; HttpOnly; Secure; SameSite=None; Max-Age=0");
        res.addHeader("Set-Cookie", "siti_csrf=; Path=/; Secure; SameSite=None; Max-Age=0");
        return ResponseEntity.ok(Map.of("message", "logout ok"));
    }

    @GetMapping("/me")
    @Operation(summary = "Get current user", description = "Get information about currently logged in admin")
    public ResponseEntity<?> me() {
        return ResponseEntity.ok(Map.of("message","ok"));
    }

    private static String genCsrf() {
        byte[] buf = new byte[32];
        new SecureRandom().nextBytes(buf);
        return Base64.getUrlEncoder().withoutPadding().encodeToString(buf);
    }
}