package com.ssafy.config;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.config.server.EnableConfigServer;
import java.util.TimeZone;

@SpringBootApplication
@EnableConfigServer
public class ConfigApplication {

	public static void main(String[] args) {
		TimeZone.setDefault(TimeZone.getTimeZone("Asia/Seoul"));
		SpringApplication.run(ConfigApplication.class, args);
	}

}
