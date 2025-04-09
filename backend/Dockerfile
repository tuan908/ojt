# Stage 1: Build the JAR using Gradle
FROM gradle:8.9-jdk21 AS builder

# Install dos2unix for potential line ending fixes
RUN apt-get update && apt-get install -y dos2unix

# Set working directory inside the container
WORKDIR /app

# Debug: List contents before copying
RUN echo "Container directory before copy:" && ls -la

# Copy everything first
COPY . .

# Debug: List contents after copying
RUN echo "Container directory after copy:" && ls -la

# Fix WSL-specific issues with gradlew if it exists
RUN if [ -f gradlew ]; then \
      echo "Found gradlew file, fixing permissions"; \
      dos2unix gradlew; \
      chmod +x gradlew; \
      ls -la gradlew; \
    else \
      echo "gradlew not found, generating wrapper"; \
      gradle wrapper --gradle-version 8.9; \
      chmod +x gradlew; \
      ls -la gradlew; \
    fi

# Use Gradle directly instead of wrapper as a fallback
RUN if [ -f gradlew ]; then \
      echo "Using gradle wrapper"; \
      ./gradlew clean build -x test --no-daemon || exit 1; \
    else \
      echo "Using gradle directly"; \
      gradle clean build -x test --no-daemon || exit 1; \
    fi

# Stage 2: Final runtime image
FROM azul/zulu-openjdk:21-jre

WORKDIR /app

# Copy the JAR file directly - using a more specific path if possible
COPY --from=builder /app/build/libs/*.jar app.jar

# Expose the application port
EXPOSE 8080

# Start the application
ENTRYPOINT ["java", "-jar", "app.jar"]