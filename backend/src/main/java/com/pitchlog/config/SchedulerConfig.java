package com.pitchlog.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.TaskScheduler;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.concurrent.ThreadPoolTaskScheduler;

@Configuration
@EnableScheduling
public class SchedulerConfig {

    /**
     * 동적 스케줄러용 TaskScheduler 빈.
     * - poolSize 2: 라이브(10초) + 라인업(5분) 태스크가 동시에 실행될 수 있으므로 2스레드.
     * - threadNamePrefix: 로그에서 스케줄러 스레드 식별 용이.
     */
    @Bean
    public TaskScheduler dynamicTaskScheduler() {
        ThreadPoolTaskScheduler scheduler = new ThreadPoolTaskScheduler();
        scheduler.setPoolSize(2);
        scheduler.setThreadNamePrefix("pitchlog-scheduler-");
        scheduler.setWaitForTasksToCompleteOnShutdown(true);
        scheduler.setAwaitTerminationSeconds(10);
        return scheduler;
    }
}
