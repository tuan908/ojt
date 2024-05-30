package com.tuanna.ojt.api;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;

@SpringBootApplication
@EnableCaching
public class OjtSpringApiApplication {

	public static void main(String[] args) {
		SpringApplication.run(OjtSpringApiApplication.class, args);
	}

}
