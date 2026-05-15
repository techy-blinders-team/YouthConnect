package com.youthconnect.youthconnect_id;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableAsync
public class YouthconnectIdApplication {

	public static void main(String[] args) {
		SpringApplication.run(YouthconnectIdApplication.class, args);
	}

}
