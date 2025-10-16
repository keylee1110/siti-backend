package com.sitigroup.backend;

import com.sitigroup.backend.admin.AdminUser;
import com.sitigroup.backend.admin.AdminUserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@Profile("dev") // chỉ chạy khi bật profile dev
@RequiredArgsConstructor
public class AdminBootstrap implements CommandLineRunner {

    private final AdminUserRepository adminUserRepo;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        if (adminUserRepo.count() == 0) {
            AdminUser admin = AdminUser.builder()
                    .email("admin@siti.local")
                    .displayName("Admin User")
                    .passwordHash(passwordEncoder.encode("Admin123!"))
                    .role("ADMIN")
                    .build();

            adminUserRepo.save(admin);

            AdminUser dev = AdminUser.builder()
                    .email("dev@siti.local")
                    .displayName("Dev Tester")
                    .passwordHash(passwordEncoder.encode("Passw0rd!"))
                    .role("DEV")
                    .build();

            adminUserRepo.save(dev);

            System.out.println("✅ Seeded default admin & dev users.");
        } else {
            System.out.println("ℹ️ Admin users already exist, skipping seeding.");
        }
    }
}