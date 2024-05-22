package com.tuanna.ojt.api.config;

import java.util.concurrent.Executors;
import org.springframework.boot.autoconfigure.task.TaskExecutionAutoConfiguration;
import org.springframework.boot.web.embedded.tomcat.TomcatProtocolHandlerCustomizer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.task.AsyncTaskExecutor;
import org.springframework.core.task.support.TaskExecutorAdapter;

@Configuration
public class ThreadConfig {

  @Bean(TaskExecutionAutoConfiguration.APPLICATION_TASK_EXECUTOR_BEAN_NAME)
  AsyncTaskExecutor asyncTaskExecutor() {
    return new TaskExecutorAdapter(Executors.newCachedThreadPool());
  }

  @Bean
  TomcatProtocolHandlerCustomizer<?> protocolHandlerExecutorCustomizer() {
    return protocolHandler -> {
      protocolHandler.setExecutor(Executors.newCachedThreadPool());
    };
  }

}
