package com.ssafy.keywordRanking.scheduler;

import lombok.RequiredArgsConstructor;
import org.springframework.batch.core.Job;
import org.springframework.batch.core.JobParameters;
import org.springframework.batch.core.JobParametersBuilder;
import org.springframework.batch.core.launch.JobLauncher;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class BatchJobScheduler {

    private final JobLauncher jobLauncher;
    private final Job keywordRankingJob;

    @Scheduled(cron = "0 */2 * * * *") // 매 2분마다 실행
    public void runKeywordRankingJob() {
        try {
            JobParameters jobParameters = new JobParametersBuilder()
                    .addLong("time", System.currentTimeMillis()) // 매 실행마다 다른 파라미터
                    .toJobParameters();

            jobLauncher.run(keywordRankingJob, jobParameters);
        } catch (Exception e) {
            e.printStackTrace(); // 로그 처리 권장
        }
    }
}