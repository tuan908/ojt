package com.tuanna.ojt.api;

import java.util.ArrayList;
import java.util.List;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;

@SpringBootApplication
@EnableCaching
public class OjtSpringApiApplication {

	public static void main(String[] args) {
		List<String> finalArgs = new ArrayList<String>();
		// Use profile local if exist:
		if (!List.of(args).contains("--spring.profiles.active=default")) {
			finalArgs.add("--spring.profiles.active=local");
		}

		SpringApplication.run(OjtSpringApiApplication.class, finalArgs.toArray(String[]::new));
	}

}
