package com.pitchlog.api.dto;

import com.pitchlog.domain.entity.Match;
import com.pitchlog.domain.entity.MatchLineupEntry;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

public record MatchDetailResponse(
        Integer fixtureId,
        String round,
        String groupName,
        LocalDateTime matchDate,
        String venueName,
        String venueCity,
        String statusShort,
        String statusLong,
        Integer elapsed,
        TeamInfo home,
        TeamInfo away,
        List<LineupTeam> lineups
) {
    public record TeamInfo(
            Integer teamApiId,
            String name,
            String logo,
            Integer goals
    ) {}

    public record LineupTeam(
            Integer teamApiId,
            String teamName,
            String formation,
            List<LineupPlayer> startXI,
            List<LineupPlayer> substitutes
    ) {}

    public record LineupPlayer(
            Integer playerApiId,
            String name,
            Integer number,
            String pos,
            String grid
    ) {}

    public static MatchDetailResponse from(Match m, List<MatchLineupEntry> entries) {
        // 팀별 분류
        var byTeam = entries.stream()
                .collect(Collectors.groupingBy(MatchLineupEntry::getTeamApiId));

        List<LineupTeam> lineups = byTeam.entrySet().stream()
                .map(e -> {
                    List<MatchLineupEntry> all = e.getValue();
                    String formation = all.stream()
                            .map(MatchLineupEntry::getFormation)
                            .filter(java.util.Objects::nonNull)
                            .findFirst().orElse(null);
                    String teamName = all.stream()
                            .map(MatchLineupEntry::getTeamName)
                            .filter(java.util.Objects::nonNull)
                            .findFirst().orElse(null);

                    List<LineupPlayer> startXI = all.stream()
                            .filter(p -> !p.isSubstitute())
                            .map(MatchDetailResponse::toLineupPlayer)
                            .collect(Collectors.toList());

                    List<LineupPlayer> subs = all.stream()
                            .filter(MatchLineupEntry::isSubstitute)
                            .map(MatchDetailResponse::toLineupPlayer)
                            .collect(Collectors.toList());

                    return new LineupTeam(e.getKey(), teamName, formation, startXI, subs);
                })
                .collect(Collectors.toList());

        return new MatchDetailResponse(
                m.getFixtureId(),
                m.getRound(),
                m.getGroupName(),
                m.getMatchDate(),
                m.getVenueName(),
                m.getVenueCity(),
                m.getStatusShort(),
                m.getStatusLong(),
                m.getElapsed(),
                new TeamInfo(m.getHomeTeamApiId(), m.getHomeTeamName(), m.getHomeTeamLogo(), m.getHomeGoals()),
                new TeamInfo(m.getAwayTeamApiId(), m.getAwayTeamName(), m.getAwayTeamLogo(), m.getAwayGoals()),
                lineups
        );
    }

    private static LineupPlayer toLineupPlayer(MatchLineupEntry e) {
        return new LineupPlayer(e.getPlayerApiId(), e.getPlayerName(),
                e.getPlayerNumber(), e.getPos(), e.getGrid());
    }
}
