package com.sitigroup.backend;

import com.sitigroup.backend.admin.AdminUser;
import com.sitigroup.backend.admin.AdminUserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@Profile("prod") // QUAN TRỌNG: Chỉ chạy khi profile là "prod"
@RequiredArgsConstructor
public class ProductionAdminCreator implements CommandLineRunner {

    private final AdminUserRepository adminUserRepo;
    private final PasswordEncoder passwordEncoder;

    // Đọc giá trị từ Biến Môi trường trên Render
    @Value("${PROD_ADMIN_EMAIL:}")
    private String adminEmail;

    @Value("${PROD_ADMIN_PASSWORD:}")
    private String adminPassword;

    @Override
    public void run(String... args) {
        if (adminEmail.isBlank() || adminPassword.isBlank()) {
            System.out.println("⚠️ PROD_ADMIN_EMAIL hoặc PROD_ADMIN_PASSWORD chưa được thiết lập, bỏ qua việc tạo admin.");
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
            System.out.println("✅ Đã tạo tài khoản admin production thành công cho email: " + adminEmail);
        } else {
            System.out.println("ℹ️ Tài khoản admin production đã tồn tại, bỏ qua việc tạo mới.");
        }
    }
}
