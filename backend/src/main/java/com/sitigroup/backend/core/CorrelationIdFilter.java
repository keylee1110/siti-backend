package com.sitigroup.backend.core;

import jakarta.servlet.*;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.UUID;

@Component
public class CorrelationIdFilter implements Filter {
    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {
        String cid = UUID.randomUUID().toString();
        HttpServletResponse res = (HttpServletResponse) response;
        res.setHeader("X-Correlation-Id", cid);
        chain.doFilter(request, response);
    }
}