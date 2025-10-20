# Sử dụng một image Java 21 (JRE là đủ) làm nền
FROM eclipse-temurin:21-jre-jammy

# Đặt thư mục làm việc bên trong container là /app
WORKDIR /app

# Copy file JAR đã được build từ thư mục target vào trong container
# và đổi tên thành app.jar cho đơn giản
COPY target/backend-0.0.1-SNAPSHOT.jar app.jar

# Báo cho Docker biết rằng ứng dụng sẽ chạy ở cổng 8080
EXPOSE 8080

# Lệnh để chạy ứng dụng khi container khởi động
CMD ["java", "-jar", "app.jar"]
