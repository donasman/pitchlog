package com.pitchlog.domain.entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

/**
 * API-Football /odds 응답을 저장하는 엔티티.
 * bookmaker=1 (Bet365)의 "Match Winner" (1X2) 배당만 수집.
 * UNIQUE 제약: fixture_id (경기당 1건)
 */
@Entity
@Table(
    name = "fixture_odds",
    uniqueConstraints = @UniqueConstraint(columnNames = "fixture_id")
)
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class FixtureOdds {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "fixture_id", nullable = false)
    private Integer fixtureId;

    /** 북메이커 ID (1 = Bet365) */
    @Column(name = "bookmaker_id")
    private Integer bookmakerId;

    @Column(name = "bookmaker_name")
    private String bookmakerName;

    /** "Match Winner" 베팅 이름 */
    @Column(name = "bet_name")
    private String betName;

    /** 홈 승 배당 (예: "1.85") */
    @Column(name = "home_odd")
    private String homeOdd;

    /** 무승부 배당 */
    @Column(name = "draw_odd")
    private String drawOdd;

    /** 원정 승 배당 */
    @Column(name = "away_odd")
    private String awayOdd;

    public static FixtureOdds create(
            Integer fixtureId, Integer bookmakerId, String bookmakerName,
            String betName, String homeOdd, String drawOdd, String awayOdd) {
        FixtureOdds o = new FixtureOdds();
        o.fixtureId     = fixtureId;
        o.bookmakerId   = bookmakerId;
        o.bookmakerName = bookmakerName;
        o.betName       = betName;
        o.homeOdd       = homeOdd;
        o.drawOdd       = drawOdd;
        o.awayOdd       = awayOdd;
        return o;
    }

    public void update(String homeOdd, String drawOdd, String awayOdd) {
        this.homeOdd = homeOdd;
        this.drawOdd = drawOdd;
        this.awayOdd = awayOdd;
    }
}
