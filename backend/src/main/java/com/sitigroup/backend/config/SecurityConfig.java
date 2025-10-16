package com.sitigroup.backend.config;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                // CSRF: sẽ bật double-submit ở chặng Auth; hiện tạm tắt cho public GET
                .csrf(csrf -> csrf.disable())
                // CORS: dùng CorsConfig đã tạo (WebMvcConfigurer)
                .cors(Customizer.withDefaults())
                // Stateless cho JWT
                .sessionManagement(sm -> sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                // Tắt form login & basic auth vì ta dùng JWT
                .formLogin(AbstractHttpConfigurer::disable)
                .httpBasic(AbstractHttpConfigurer::disable)
                // Phân quyền
                .authorizeHttpRequests(auth -> auth
                        // Swagger / OpenAPI
                        .requestMatchers("/v3/api-docs/**", "/swagger-ui.html", "/swagger-ui/**").permitAll()
                        // Public GET endpoints
                        .requestMatchers(HttpMethod.GET, "/api/club", "/api/events/**").permitAll()
                        // Auth endpoints (login/logout/me) để mở cho FE
                        .requestMatchers("/api/auth/**").permitAll()
                        // Admin APIs (sẽ yêu cầu JWT + CSRF khi làm chặng 4)
                        .requestMatchers("/api/admin/**").hasRole("ADMIN") // tức cần authority "ROLE_ADMIN"
                        // Còn lại cho phép hoặc tuỳ bạn siết chặt:
                        .anyRequest().permitAll()
                );

        // TODO (Chặng 4): addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);
        // TODO (Chặng 4): addFilterAfter(csrfDoubleSubmitFilter, JwtAuthenticationFilter.class);

        return http.build();
    }
}
