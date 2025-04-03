package com.ssafy.config;

import co.elastic.clients.elasticsearch.ElasticsearchClient;
import co.elastic.clients.transport.rest_client.RestClientTransport;
import co.elastic.clients.json.jackson.JacksonJsonpMapper;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import org.apache.http.HttpHost;
import org.elasticsearch.client.RestClient;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.context.config.annotation.RefreshScope;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
@RefreshScope
@Configuration
public class ElasticsearchConfig {

    @Value("${spring.config.elastic.host}")
    private String host;

    @Value("${spring.config.elastic.port}")
    private int port;

    @Bean
    public ElasticsearchClient elasticsearchClient() {
        // LocalDateTime, Instant 등을 처리할 수 있도록 모듈 등록
        System.out.println("Connecting to Elasticsearch at " + host + ":" + port);

        ObjectMapper objectMapper = new ObjectMapper();
        objectMapper.registerModule(new JavaTimeModule());

        RestClient restClient = RestClient.builder(
                new HttpHost(host, port, "https")
        ).build();

        RestClientTransport transport = new RestClientTransport(
                restClient,
                new JacksonJsonpMapper(objectMapper)
        );

        return new ElasticsearchClient(transport);
    }
}