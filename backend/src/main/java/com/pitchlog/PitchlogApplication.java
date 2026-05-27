package com.pitchlog;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class PitchlogApplication {

    public static void main(String[] args) {
        SpringApplication.run(PitchlogApplication.class, args);
    }
}
