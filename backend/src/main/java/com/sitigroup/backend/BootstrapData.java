package com.sitigroup.backend;

import com.sitigroup.backend.club.*;
import com.sitigroup.backend.events.*;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Component
@Profile("dev") // chỉ chạy khi bật profile dev
@RequiredArgsConstructor
public class BootstrapData implements CommandLineRunner {

    private final ClubRepository clubRepo;
    private final EventRepository eventRepo;

    @Override
    public void run(String... args) {
        if (clubRepo.count() == 0) {
            Club club = Club.builder()
                    .officialName("Câu lạc bộ tổ chức hoạt động xã hội vì cộng đồng trường Đại học FPT HCM - Cộng đồng Sinh viên Tình nguyện SiTiGroup")
                    .shortName("SiTiGroup")
                    .foundedDate("2009-07-15")
                    .founder("Lê Anh Bảo")
                    .mission("Kết nối sinh viên tình nguyện nhiệt huyết để tạo tác động tích cực cho cộng đồng.")
                    .featuredImages(List.of())
                    .contactEmail("sitigroup.fptuhcm@gmail.com")
                    .facebookUrl("https://www.facebook.com/sitigroupfuhcm")
                    .website("https://sitigroup.vn")
                    .build();
            clubRepo.save(club);
        }

        if (eventRepo.count() == 0) {
            Event e1 = Event.builder()
                    .title("Lớp Học Tình Thương")
                    .summary("Workshop gây quỹ")
                    .description("Mô tả chi tiết...")
                    .status(Event.Status.PUBLISHED)
                    .startAt(Instant.now().plus(10, ChronoUnit.DAYS))
                    .endAt(Instant.now().plus(10, ChronoUnit.DAYS).plus(2, ChronoUnit.HOURS))
                    .coverImage(null)
                    .gallery(List.of())
                    .location(new Event.Location("Khu đô thị Sala", 10.772, 106.72))
                    .build();

            Event e2 = Event.builder()
                    .title("Convocation Day")
                    .summary("Hoạt động ")
                    .description("Mô tả chi tiết...")
                    .status(Event.Status.PUBLISHED)
                    .startAt(Instant.now().plus(20, ChronoUnit.DAYS))
                    .endAt(Instant.now().plus(20, ChronoUnit.DAYS).plus(3, ChronoUnit.HOURS))
                    .location(new Event.Location("Crescent Mall", 10.73, 106.72))
                    .build();

            eventRepo.saveAll(List.of(e1, e2));
        }
    }


}
