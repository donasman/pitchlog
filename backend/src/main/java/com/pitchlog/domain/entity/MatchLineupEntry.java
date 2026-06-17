package com.pitchlog.domain.entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "match_lineup_entries", uniqueConstraints = {
        @UniqueConstraint(
                name = "uq_match_lineup",
                columnNames = {"fixture_id", "player_api_id", "team_api_id"}
        )
})
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class MatchLineupEntry {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "fixture_id", nullable = false)
    private Integer fixtureId;

    @Column(name = "team_api_id", nullable = false)
    private Integer teamApiId;

    @Column(name = "team_name", length = 100)
    private String teamName;

    /** "4-3-3", "4-2-3-1" 등 */
    @Column(name = "formation", length = 20)
    private String formation;

    @Column(name = "player_api_id", nullable = false)
    private Integer playerApiId;

    @Column(name = "player_name", length = 100)
    private String playerName;

    @Column(name = "player_number")
    private Integer playerNumber;

    /** "G" / "D" / "M" / "F" */
    @Column(name = "pos", length = 3)
    private String pos;

    /** 피치 그리드 좌표 예: "1:1", "2:3" (row:col) */
    @Column(name = "grid", length = 10)
    private String grid;

    /** false = 선발, true = 교체 후보 */
    @Column(name = "is_substitute", nullable = false)
    private boolean substitute;

    /** API-Football 선수 평점 (0.0 ~ 10.0) — 경기 종료 후 수집 */
    @Column(name = "rating", precision = 4, scale = 2)
    private Double rating;

    /** 출전 시간(분) */
    @Column(name = "minutes_played")
    private Integer minutesPlayed;

    /** 골 수 */
    @Column(name = "goals_scored")
    private Integer goalsScored;

    /** 도움 수 */
    @Column(name = "assists_made")
    private Integer assistsMade;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public static MatchLineupEntry create(Integer fixtureId, Integer teamApiId, String teamName,
                                          String formation, Integer playerApiId, String playerName,
                                          Integer playerNumber, String pos, String grid, boolean substitute) {
        MatchLineupEntry e = new MatchLineupEntry();
        e.fixtureId = fixtureId;
        e.teamApiId = teamApiId;
        e.teamName = teamName;
        e.formation = formation;
        e.playerApiId = playerApiId;
        e.playerName = playerName;
        e.playerNumber = playerNumber;
        e.pos = pos;
        e.grid = grid;
        e.substitute = substitute;
        return e;
    }

    public void updateStats(Double rating, Integer minutesPlayed, Integer goalsScored, Integer assistsMade) {
        this.rating       = rating;
        this.minutesPlayed = minutesPlayed;
        this.goalsScored  = goalsScored;
        this.assistsMade  = assistsMade;
    }
}
