package com.tuanna.ojt.api.config;

import java.util.List;
import org.springframework.cache.CacheManager;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.cache.concurrent.ConcurrentMapCache;
import org.springframework.cache.support.SimpleCacheManager;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * CacheConfig
 */
@Configuration
@EnableCaching
public class CacheConfig {

  @Bean
  CacheManager cacheManager() {
    var simpleCacheManager = new SimpleCacheManager();
    var caches = List.of("grades", "events", "hashtags").parallelStream()
        .map(name -> new ConcurrentMapCache(name)).toList();
    simpleCacheManager.setCaches(caches);
    return simpleCacheManager;
  }
}
