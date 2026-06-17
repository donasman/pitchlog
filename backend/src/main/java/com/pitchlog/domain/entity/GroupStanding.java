package com.pitchlog.domain.entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "group_standings", uniqueConstraints = {
        @UniqueConstraint(name = "uq_group_standings_team", columnNames = "team_api_id")
})
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@EqualsAndHashCode(of = "id")
public class GroupStanding {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "group_name", nullable = false, length = 20)
    private String groupName;       // "Group A" ~ "Group L"

    @Column(name = "team_api_id", nullable = false)
    private Integer teamApiId;

    @Column(name = "team_name", nullable = false, length = 100)
    private String teamName;

    @Column(name = "team_logo", length = 500)
    private String teamLogo;

    @Column(name = "rank", nullable = false)
    private Integer rank;

    @Column(name = "played")
    private Integer played;

    @Column(name = "win")
    private Integer win;

    @Column(name = "draw")
    private Integer draw;

    @Column(name = "lose")
    private Integer lose;

    @Column(name = "goals_for")
    private Integer goalsFor;

    @Column(name = "goals_against")
    private Integer goalsAgainst;

    @Column(name = "goals_diff")
    private Integer goalsDiff;

    @Column(name = "points")
    private Integer points;

    @Column(name = "form", length = 10)
    private String form;            // "WWDLW" (최근 5경기)

    @Column(name = "description", length = 100)
    private String description;     // "Promotion - World Cup (Play Offs)"

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    // ── 정적 팩토리 메서드 ────────────────────────────────────────────────
    public static GroupStanding create(
            String groupName, Integer teamApiId, String teamName, String teamLogo,
            Integer rank, Integer played, Integer win, Integer draw, Integer lose,
            Integer goalsFor, Integer goalsAgainst, Integer goalsDiff, Integer points,
            String form, String description) {

        GroupStanding gs = new GroupStanding();
        gs.groupName    = groupName;
        gs.teamApiId    = teamApiId;
        gs.teamName     = teamName;
        gs.teamLogo     = teamLogo;
        gs.rank         = rank;
        gs.played       = played;
        gs.win          = win;
        gs.draw         = draw;
        gs.lose         = lose;
        gs.goalsFor     = goalsFor;
        gs.goalsAgainst = goalsAgainst;
        gs.goalsDiff    = goalsDiff;
        gs.points       = points;
        gs.form         = form;
        gs.description  = description;
        return gs;
    }

    public void update(
            String groupName, String teamName, String teamLogo,
            Integer rank, Integer played, Integer win, Integer draw, Integer lose,
            Integer goalsFor, Integer goalsAgainst, Integer goalsDiff, Integer points,
            String form, String description) {

        this.groupName    = groupName;
        this.teamName     = teamName;
        this.teamLogo     = teamLogo;
        this.rank         = rank;
        this.played       = played;
        this.win          = win;
        this.draw         = draw;
        this.lose         = lose;
        this.goalsFor     = goalsFor;
        this.goalsAgainst = goalsAgainst;
        this.goalsDiff    = goalsDiff;
        this.points       = points;
        this.form         = form;
        this.description  = description;
    }
}
