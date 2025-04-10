package com.tuanna.api.config;

import java.time.Duration;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.CacheManager;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.cache.RedisCacheConfiguration;
import org.springframework.data.redis.cache.RedisCacheManager;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.connection.RedisStandaloneConfiguration;
import org.springframework.data.redis.connection.lettuce.LettuceClientConfiguration;
import org.springframework.data.redis.connection.lettuce.LettuceConnectionFactory;
import org.springframework.data.redis.serializer.GenericJackson2JsonRedisSerializer;
import org.springframework.data.redis.serializer.RedisSerializationContext;

@Configuration
@EnableCaching
public class CacheConfig {

  @Value("${spring.data.redis.host:localhost}")
  private String redisHost;

  @Value("${spring.data.redis.port:6379}")
  private int redisPort;

  @Value("${spring.data.redis.password}")
  private String redisPassword;

  @Bean
  LettuceConnectionFactory redisConnectionFactory() {
    var redisConfig = new RedisStandaloneConfiguration(redisHost, redisPort);

    if (redisPassword != null && !redisPassword.isEmpty()) {
      redisConfig.setPassword(redisPassword);
    }

    LettuceClientConfiguration clientConfig = LettuceClientConfiguration
        .builder()
        .commandTimeout(Duration.ofSeconds(5)) // Set
                                               // timeout
        .shutdownTimeout(Duration.ofMillis(100)) // Faster
                                                 // shutdown
        .useSsl() // use Ssl
                  // connection
        .build();

    return new LettuceConnectionFactory(redisConfig, clientConfig);
  }

  @Bean
  CacheManager cacheManager(RedisConnectionFactory redisConnectionFactory) {
    // Default cache settings
    RedisCacheConfiguration defaultCacheConfig = createCacheConfig(Duration.ofMinutes(10));

    // Custom cache settings
    Map<String, RedisCacheConfiguration> cacheConfigurations = Map
        .of("grades", createCacheConfig(Duration.ofHours(1)), "events",
            createCacheConfig(Duration.ofHours(4)), "hashtags",
            createCacheConfig(Duration.ofDays(1)));

    return RedisCacheManager
        .builder(redisConnectionFactory)
        .cacheDefaults(defaultCacheConfig)
        .withInitialCacheConfigurations(cacheConfigurations)
        .build();
  }

  private RedisCacheConfiguration createCacheConfig(Duration ttl) {
    return RedisCacheConfiguration
        .defaultCacheConfig()
        .entryTtl(ttl)
        .disableCachingNullValues()
        .serializeValuesWith(RedisSerializationContext.SerializationPair
            .fromSerializer(new GenericJackson2JsonRedisSerializer()));
  }
}
