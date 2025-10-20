# Giai đoạn 1: Build ứng dụng với Maven
FROM maven:3.9.6-eclipse-temurin-21 AS builder

# Tạo thư mục làm việc
WORKDIR /app

# Copy file pom.xml và thư mục .mvn để tải dependencies
COPY pom.xml .
COPY .mvn/ .mvn/

# Copy toàn bộ source code
COPY src src/

# Chạy lệnh build của Maven để tạo file .jar
# -DskipTests để bỏ qua việc chạy test, giúp build nhanh hơn trên server
RUN mvn clean package -DskipTests

# Giai đoạn 2: Tạo image cuối cùng để chạy
FROM eclipse-temurin:21-jre-jammy

WORKDIR /app

# Copy file .jar đã được build từ giai đoạn 'builder'
COPY --from=builder /app/target/backend-0.0.1-SNAPSHOT.jar app.jar

EXPOSE 8080

# Lệnh chạy ứng dụng
CMD ["java", "-jar", "app.jar"]