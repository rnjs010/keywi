package com.ssafy.feed.config;

import org.apache.ibatis.session.SqlSessionFactory;
import org.mybatis.spring.SqlSessionFactoryBean;
import org.mybatis.spring.SqlSessionTemplate;
import org.mybatis.spring.annotation.MapperScan;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.Resource;
import org.springframework.core.io.support.PathMatchingResourcePatternResolver;

import javax.sql.DataSource;

@Configuration
@MapperScan("com.ssafy.feed.mapper")
public class MyBatisConfig {

    @Autowired
    private DataSource dataSource;

    @Bean
    public SqlSessionFactory sqlSessionFactory() throws Exception {
        SqlSessionFactoryBean sessionFactory = new SqlSessionFactoryBean();
        sessionFactory.setDataSource(dataSource);

        // MyBatis 설정
        org.apache.ibatis.session.Configuration configuration = new org.apache.ibatis.session.Configuration();

        // TypeHandler 등록
        configuration.getTypeHandlerRegistry().register(JsonTypeHandler.class);
        configuration.getTypeHandlerRegistry().register(LocalDateTimeTypeHandler.class);

        sessionFactory.setConfiguration(configuration);

        // XML 매퍼 위치 설정
        Resource[] resources = new PathMatchingResourcePatternResolver()
                .getResources("classpath:mappers/**/*.xml");
        sessionFactory.setMapperLocations(resources);

        return sessionFactory.getObject();
    }
}
