package com.ssafy.search.config;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.transaction.annotation.EnableTransactionManagement;

/**
 * MyBatis 관련 설정을 담당하는 설정 클래스
 */
@Configuration
@MapperScan("com.ssafy.search.mapper")  // 매퍼 인터페이스가 위치한 패키지 지정
@EnableTransactionManagement  // 트랜잭션 관리 활성화
public class MyBatisConfig {
    // 필요한 경우 추가 설정을 여기에 작성
}