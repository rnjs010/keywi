# 로그인 msa 전환 공부

## 프로젝트 폴더 구성
```
keywi/
├── keywi-eureka/
├── keywi-gateway/
└── keywi-auth/
```
### Eureka Server 설정
```
package com.keywi.eureka;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.netflix.eureka.server.EnableEurekaServer;

@SpringBootApplication
@EnableEurekaServer
public class KeywiEurekaApplication {
    public static void main(String[] args) {
        SpringApplication.run(KeywiEurekaApplication.class, args);
    }
}
```
### yml설정
```
server:
  port: 8761

spring:
  application:
    name: keywi-eureka

eureka:
  client:
    register-with-eureka: false
    fetch-registry: false
  server:
    enable-self-preservation: false
```
### API Gateway 설정
```
package com.keywi.gateway;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

@SpringBootApplication
@EnableDiscoveryClient
public class KeywiGatewayApplication {
    public static void main(String[] args) {
        SpringApplication.run(KeywiGatewayApplication.class, args);
    }
}
```
### yml 설정
```
server:
  port: 8080

spring:
  application:
    name: keywi-gateway
  cloud:
    gateway:
      routes:
        - id: auth-service
          uri: lb://keywi-auth
          predicates:
            - Path=/api/auth/**
          filters:
            - StripPrefix=1

eureka:
  client:
    service-url:
      defaultZone: http://localhost:8761/eureka/
  instance:
    instance-id: ${spring.application.name}:${random.uuid}
```

