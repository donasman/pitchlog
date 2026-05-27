package com.pitchlog.domain.entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "squad_entries", uniqueConstraints = {
        @UniqueConstraint(
                name = "uq_squad_entries",
                columnNames = {"player_id", "country_id"}
        )
})
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class SquadEntry {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "player_id", nullable = false)
    private Player player;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "country_id", nullable = false)
    private Country country;

    @Column(name = "jersey_number")
    private Integer jerseyNumber;

    @Enumerated(EnumType.STRING)
    @Column(length = 20)
    private Position position;     // GK, DEF, MID, FWD

    @Column(name = "is_active", nullable = false)
    private boolean active = true; // 최종 엔트리 확정 여부

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public enum Position {
        GK, DEF, MID, FWD
    }

    // 정적 팩토리 메서드
    public static SquadEntry create(Player player, Country country,
                                    Integer jerseyNumber, Position position) {
        SquadEntry entry = new SquadEntry();
        entry.player = player;
        entry.country = country;
        entry.jerseyNumber = jerseyNumber;
        entry.position = position;
        entry.active = true;
        return entry;
    }

    public void update(Integer jerseyNumber, Position position, boolean active) {
        this.jerseyNumber = jerseyNumber;
        this.position = position;
        this.active = active;
    }
}
