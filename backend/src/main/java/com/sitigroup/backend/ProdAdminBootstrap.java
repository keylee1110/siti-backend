package com.sitigroup.backend;

import com.sitigroup.backend.admin.AdminUser;
import com.sitigroup.backend.admin.AdminUserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.core.env.Environment;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@Profile("prod")
@RequiredArgsConstructor
public class ProdAdminBootstrap implements CommandLineRunner {

    private final AdminUserRepository adminUserRepo;
    private final PasswordEncoder passwordEncoder;
    private final Environment env;

    @Override
    public void run(String... args) {
        String adminEmail = env.getProperty("PROD_ADMIN_EMAIL");
        String adminPassword = env.getProperty("PROD_ADMIN_PASSWORD");

        if (adminEmail == null || adminPassword == null) {
            System.err.println("❌ PROD_ADMIN_EMAIL or PROD_ADMIN_PASSWORD environment variables are not set. Skipping production admin user creation.");
            return;
        }

        if (adminUserRepo.findByEmail(adminEmail).isEmpty()) {
            AdminUser admin = AdminUser.builder()
                    .email(adminEmail)
                    .displayName("Production Admin")
                    .passwordHash(passwordEncoder.encode(adminPassword))
                    .role("ADMIN")
                    .build();

            adminUserRepo.save(admin);
            System.out.println("✅ Seeded production admin user: " + adminEmail);
        } else {
            System.out.println("ℹ️ Production admin user already exists: " + adminEmail + ", skipping seeding.");
        }
    }
}
