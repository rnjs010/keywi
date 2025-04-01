package com.ssafy.config;

import com.ssafy.keywordRanking.dto.KeywordDto;
import com.ssafy.keywordRanking.dto.KeywordRankDto;
import lombok.RequiredArgsConstructor;
import org.springframework.batch.core.Job;
import org.springframework.batch.core.Step;
import org.springframework.batch.core.configuration.annotation.JobScope;
import org.springframework.batch.core.job.builder.JobBuilder;
import org.springframework.batch.core.repository.JobRepository;
import org.springframework.batch.core.step.builder.StepBuilder;
import org.springframework.batch.item.ItemProcessor;
import org.springframework.batch.item.ItemReader;
import org.springframework.batch.item.ItemWriter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.transaction.PlatformTransactionManager;

@Configuration
@RequiredArgsConstructor
public class KeywordRankingJobConfig {

    private final JobRepository jobRepository;
    private final PlatformTransactionManager transactionManager;

    private final ItemReader<KeywordDto> keywordRankingReader;
    private final ItemProcessor<KeywordDto, KeywordRankDto> keywordRankingProcessor;
    private final ItemWriter<KeywordRankDto> keywordRankingWriter;

    @Bean
    public Job keywordRankingJob() {
        return new JobBuilder("keywordRankingJob", jobRepository)
                .start(keywordRankingStep())
                .build();
    }

    @Bean
    @JobScope
    public Step keywordRankingStep() {
        return new StepBuilder("keywordRankingStep", jobRepository)
                .<KeywordDto, KeywordRankDto>chunk(10, transactionManager)
                .reader(keywordRankingReader)
                .processor(keywordRankingProcessor)
                .writer(keywordRankingWriter)
                .build();
    }
}
