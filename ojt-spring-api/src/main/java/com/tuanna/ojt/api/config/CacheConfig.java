package com.tuanna.ojt.api.config;

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
        simpleCacheManager.setCaches(java.util.Set.of(new ConcurrentMapCache("default")));
        return simpleCacheManager;
    }
}
