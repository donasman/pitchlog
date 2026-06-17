package com.pitchlog.domain.entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

/**
 * 부상 / 출전정지 선수 정보.
 *
 * API-Football /injuries?league=1&season=2026 로 수집.
 * 스케줄러가 30분마다 전체 DELETE → INSERT 방식으로 갱신해
 * 항상 현재 상태를 반영한다.
 *
 * injuryType 예시: "Knee Injury", "Suspension", "Muscle Injury"
 * reason      예시: "Muscular", "Yellow Cards", "Ankle"
 */
@Entity
@Table(name = "player_injuries", uniqueConstraints = {
        @UniqueConstraint(name = "uq_player_injuries", columnNames = {"player_api_id", "fixture_id"})
})
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@EqualsAndHashCode(of = "id")
public class PlayerInjury {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "player_api_id", nullable = false)
    private Integer playerApiId;

    @Column(name = "player_name", nullable = false, length = 100)
    private String playerName;

    @Column(name = "player_photo", length = 500)
    private String playerPhoto;

    @Column(name = "team_api_id")
    private Integer teamApiId;

    @Column(name = "team_name", length = 100)
    private String teamName;

    @Column(name = "team_logo", length = 500)
    private String teamLogo;

    @Column(name = "fixture_id")
    private Integer fixtureId;

    @Column(name = "fixture_date")
    private LocalDateTime fixtureDate;

    @Column(name = "injury_type", length = 100)
    private String injuryType;   // "Knee Injury" | "Suspension"

    @Column(name = "reason", length = 100)
    private String reason;       // "Muscular" | "Yellow Cards"

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    // ── 정적 팩토리 ────────────────────────────────────────────────────────
    public static PlayerInjury create(
            Integer playerApiId, String playerName, String playerPhoto,
            Integer teamApiId, String teamName, String teamLogo,
            Integer fixtureId, LocalDateTime fixtureDate,
            String injuryType, String reason) {

        PlayerInjury injury = new PlayerInjury();
        injury.playerApiId = playerApiId;
        injury.playerName  = playerName;
        injury.playerPhoto = playerPhoto;
        injury.teamApiId   = teamApiId;
        injury.teamName    = teamName;
        injury.teamLogo    = teamLogo;
        injury.fixtureId   = fixtureId;
        injury.fixtureDate = fixtureDate;
        injury.injuryType  = injuryType;
        injury.reason      = reason;
        return injury;
    }
}
