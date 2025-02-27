package com.tuanna.api;

import java.util.ArrayList;
import java.util.List;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.data.web.config.EnableSpringDataWebSupport;
import org.springframework.data.web.config.EnableSpringDataWebSupport.PageSerializationMode;

@SpringBootApplication
@EnableCaching
@EnableSpringDataWebSupport(pageSerializationMode = PageSerializationMode.VIA_DTO)
public class SpringApiApplication {

	public static void main(String[] args) {
		List<String> finalArgs = new ArrayList<String>();
		// Use profile local if exist:
		if (!List.of(args).contains("--spring.profiles.active=default")) {
			finalArgs.add("--spring.profiles.active=local");
		}

		SpringApplication.run(SpringApiApplication.class, finalArgs.toArray(String[]::new));
	}

}
