package com.sitigroup.backend.auth;

import com.sitigroup.backend.admin.AdminUser;
import com.sitigroup.backend.admin.AdminUserRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.security.SecureRandom;
import java.util.Base64;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import com.sitigroup.backend.core.ApiResponse;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Tag(name = "Auth", description = "Authentication endpoints")
public class AuthController {
    private final AdminUserRepository repo;
    private final JwtService jwt;
    private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

    @Value("${app.cookie.secure:false}")
    private boolean cookieSecure;

    @PostMapping("/login")
    @Operation(summary = "Admin login", description = "Login and receive JWT token in httpOnly cookie")
    public ResponseEntity<ApiResponse<Map<String, Object>>> login(@RequestBody Map<String, String> body, HttpServletResponse res) {
        String email = body.get("email");
        String password = body.get("password");
        AdminUser user = repo.findByEmail(email).orElse(null);
        if (user == null || !encoder.matches(password, user.getPasswordHash())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ApiResponse.error(Map.of(
                            "type", "UNAUTHORIZED",
                            "message", "Invalid credentials"
                    ), null));
        }

        String token = jwt.generate(user.getId(), user.getEmail(), user.getRole());
        String csrf = genCsrf();

        // Set cookie via header
        String tokenCookie, csrfCookie;
        if (cookieSecure) {
            tokenCookie = "siti_token=" + token + "; Path=/; HttpOnly; Secure; SameSite=None";
            csrfCookie = "siti_csrf=" + csrf  + "; Path=/; Secure; SameSite=None";
        } else {
            tokenCookie = "siti_token=" + token + "; Path=/; HttpOnly; SameSite=Lax";
            csrfCookie = "siti_csrf=" + csrf  + "; Path=/; SameSite=Lax";
        }
        res.addHeader("Set-Cookie", tokenCookie);
        res.addHeader("Set-Cookie", csrfCookie);

        res.setHeader("X-CSRF-Token", csrf);

        return ResponseEntity.ok(ApiResponse.ok(Map.of(
                "message", "login ok",
                "csrf", csrf,
                "email", user.getEmail(),
                "role", user.getRole()
        )));
    }

    @PostMapping("/logout")
    @Operation(summary = "Admin logout", description = "Clear authentication cookies")
    public ResponseEntity<?> logout(HttpServletResponse res) {
        String tokenCookie, csrfCookie;
        if (cookieSecure) {
            tokenCookie = "siti_token=; Path=/; HttpOnly; Secure; SameSite=None; Max-Age=0";
            csrfCookie = "siti_csrf=; Path=/; Secure; SameSite=None; Max-Age=0";
        } else {
            tokenCookie = "siti_token=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0";
            csrfCookie = "siti_csrf=; Path=/; SameSite=Lax; Max-Age=0";
        }
        res.addHeader("Set-Cookie", tokenCookie);
        res.addHeader("Set-Cookie", csrfCookie);
        return ResponseEntity.ok(ApiResponse.ok(Map.of("message", "logout ok")));
    }

    @GetMapping("/me")
    @Operation(summary = "Get current user", description = "Get information about currently logged in admin")
    public ResponseEntity<ApiResponse<Map<String, Object>>> me(HttpServletResponse res) {
        var auth = org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated() || "anonymousUser".equals(auth.getPrincipal())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ApiResponse.error(Map.of(
                            "type", "UNAUTHORIZED",
                            "message", "Unauthenticated"
                    ), null));
        }
        String email = (String) auth.getPrincipal();
        String role = auth.getAuthorities().stream().findFirst()
                .map(a -> a.getAuthority().replace("ROLE_", ""))
                .orElse(null);

        // Refresh CSRF token
        String csrf = genCsrf();
        String csrfCookie;
        if (cookieSecure) {
            csrfCookie = "siti_csrf=" + csrf  + "; Path=/; Secure; SameSite=None";
        } else {
            csrfCookie = "siti_csrf=" + csrf  + "; Path=/; SameSite=Lax";
        }
        res.addHeader("Set-Cookie", csrfCookie);
        res.setHeader("X-CSRF-Token", csrf);


        var userData = Map.<String, Object>of(
                "email", email,
                "role", role,
                "csrf", csrf
        );

        return ResponseEntity.ok(ApiResponse.ok(userData));
    }

    private static String genCsrf() {
        byte[] buf = new byte[32];
        new SecureRandom().nextBytes(buf);
        return Base64.getUrlEncoder().withoutPadding().encodeToString(buf);
    }
}