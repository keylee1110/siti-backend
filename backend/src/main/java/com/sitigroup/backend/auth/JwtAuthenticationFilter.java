package com.sitigroup.backend.auth;

import io.jsonwebtoken.Claims;
import jakarta.servlet.*;
import jakarta.servlet.http.*;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;
import java.io.IOException;
import java.util.List;

public class JwtAuthenticationFilter extends OncePerRequestFilter {
    @Override
    protected void doFilterInternal(HttpServletRequest req, HttpServletResponse res, FilterChain chain)
            throws ServletException, IOException {
        String token = null;
        Cookie[] cookies = req.getCookies();
        if (cookies != null) {
            for (Cookie c : cookies) if ("siti_token".equals(c.getName())) { token = c.getValue(); break; }
        }
        if (StringUtils.hasText(token)) {
            try {
                Claims claims = SpringBeans.jwt().parse(token).getBody();
                String email = (String) claims.get("email");
                String role = (String) claims.get("role");
                var auth = new UsernamePasswordAuthenticationToken(email, null,
                        List.of(new SimpleGrantedAuthority("ROLE_" + role)));
                org.springframework.security.core.context.SecurityContextHolder.getContext().setAuthentication(auth);
            } catch (Exception ignored) { }
        }
        chain.doFilter(req, res);
    }

    static class SpringBeans {
        static JwtService jwt() { return ApplicationContextHolder.getBean(JwtService.class); }
    }
}
