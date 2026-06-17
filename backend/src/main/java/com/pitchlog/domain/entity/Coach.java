package com.pitchlog.domain.entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

/**
 * 2026 FIFA 월드컵 참가국 대표팀 감독 정보.
 * team_api_id 기준 UNIQUE — 한 팀에 현역 감독 1명.
 */
@Entity
@Table(name = "coaches", uniqueConstraints = {
        @UniqueConstraint(name = "uq_coaches_team", columnNames = "team_api_id")
})
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Coach {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "coach_api_id")
    private Integer coachApiId;     // API-Football coach id (nullable — API에 없을 수 있음)

    @Column(name = "team_api_id", nullable = false)
    private Integer teamApiId;

    @Column(name = "team_name", length = 100)
    private String teamName;

    @Column(name = "team_logo", length = 500)
    private String teamLogo;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(name = "first_name", length = 50)
    private String firstName;

    @Column(name = "last_name", length = 50)
    private String lastName;

    @Column(length = 100)
    private String nationality;

    @Column(name = "birth_date", length = 20)
    private String birthDate;       // "1968-03-15" 형식의 문자열

    @Column(name = "photo_url", length = 500)
    private String photoUrl;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    // ── 정적 팩토리 ──────────────────────────────────────────────────────────

    public static Coach create(Integer coachApiId, Integer teamApiId, String teamName,
                               String teamLogo, String name, String firstName, String lastName,
                               String nationality, String birthDate, String photoUrl) {
        Coach c = new Coach();
        c.coachApiId  = coachApiId;
        c.teamApiId   = teamApiId;
        c.teamName    = teamName;
        c.teamLogo    = teamLogo;
        c.name        = name;
        c.firstName   = firstName;
        c.lastName    = lastName;
        c.nationality = nationality;
        c.birthDate   = birthDate;
        c.photoUrl    = photoUrl;
        return c;
    }

    public void update(Integer coachApiId, String teamName, String teamLogo,
                       String name, String firstName, String lastName,
                       String nationality, String birthDate, String photoUrl) {
        this.coachApiId  = coachApiId;
        this.teamName    = teamName;
        this.teamLogo    = teamLogo;
        this.name        = name;
        this.firstName   = firstName;
        this.lastName    = lastName;
        this.nationality = nationality;
        this.birthDate   = birthDate;
        this.photoUrl    = photoUrl;
    }
}
