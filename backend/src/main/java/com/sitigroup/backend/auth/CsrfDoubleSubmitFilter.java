package com.sitigroup.backend.auth;

import jakarta.servlet.*;
import jakarta.servlet.http.*;
import org.springframework.http.HttpMethod;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;
import java.io.IOException;

public class CsrfDoubleSubmitFilter extends OncePerRequestFilter {
    @Override
    protected void doFilterInternal(HttpServletRequest req, HttpServletResponse res, FilterChain chain)
            throws ServletException, IOException {
        String m = req.getMethod();
        boolean unsafe = !(HttpMethod.GET.matches(m) || HttpMethod.HEAD.matches(m) || HttpMethod.OPTIONS.matches(m));
        if (unsafe && req.getRequestURI().startsWith("/api/admin/")) {
            String header = req.getHeader("X-CSRF-Token");
            String cookieVal = null;
            Cookie[] cookies = req.getCookies();
            if (cookies != null) for (Cookie c : cookies) if ("siti_csrf".equals(c.getName())) { cookieVal = c.getValue(); break; }
            if (!StringUtils.hasText(header) || !header.equals(cookieVal)) {
                res.sendError(HttpServletResponse.SC_FORBIDDEN, "CSRF token invalid");
                return;
            }
        }
        chain.doFilter(req, res);
    }
}
