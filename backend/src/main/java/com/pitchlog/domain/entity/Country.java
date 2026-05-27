package com.pitchlog.domain.entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "countries", uniqueConstraints = {
        @UniqueConstraint(name = "uq_countries_code", columnNames = "code")
})
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Country {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 10)
    private String code;           // FIFA 국가 코드 (예: KOR, BRA) — Upsert 기준키

    @Column(nullable = false, length = 100)
    private String name;

    @Column(name = "flag_url", length = 500)
    private String flagUrl;

    @Column(name = "group_name", length = 10)
    private String groupName;      // 조 배정 (예: A, B, ... H)

    @Column(name = "team_api_id")
    private Integer teamApiId;     // API-Football 국가대표팀 ID — FetchSquadsStep에서 사용

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    private void prePersist() {
        this.createdAt = LocalDateTime.now();
    }

    // 정적 팩토리 메서드
    public static Country create(String code, String name, String flagUrl,
                                  String groupName, Integer teamApiId) {
        Country country = new Country();
        country.code = code;
        country.name = name;
        country.flagUrl = flagUrl;
        country.groupName = groupName;
        country.teamApiId = teamApiId;
        return country;
    }

    public void update(String name, String flagUrl, String groupName, Integer teamApiId) {
        this.name = name;
        this.flagUrl = flagUrl;
        this.groupName = groupName;
        this.teamApiId = teamApiId;
    }
}
