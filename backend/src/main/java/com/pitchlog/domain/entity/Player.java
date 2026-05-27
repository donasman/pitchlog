package com.pitchlog.domain.entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "players", uniqueConstraints = {
        @UniqueConstraint(name = "uq_players_api_id", columnNames = "api_player_id")
})
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@EqualsAndHashCode(of = "id")
public class Player {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "api_player_id", nullable = false)
    private Integer apiPlayerId;   // API-Football player ID — Upsert 기준키

    @Column(nullable = false, length = 100)
    private String name;

    @Column(name = "first_name", length = 50)
    private String firstName;

    @Column(name = "last_name", length = 50)
    private String lastName;

    @Column(length = 100)
    private String nationality;

    @Column(name = "birth_date")
    private LocalDate birthDate;

    @Column(length = 20)
    private String height;         // 예: "183 cm"

    @Column(length = 20)
    private String weight;         // 예: "75 kg"

    @Column(name = "photo_url", length = 500)
    private String photoUrl;

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
    public static Player create(Integer apiPlayerId, String name, String firstName,
                                String lastName, String nationality, LocalDate birthDate,
                                String height, String weight, String photoUrl) {
        Player player = new Player();
        player.apiPlayerId = apiPlayerId;
        player.name = name;
        player.firstName = firstName;
        player.lastName = lastName;
        player.nationality = nationality;
        player.birthDate = birthDate;
        player.height = height;
        player.weight = weight;
        player.photoUrl = photoUrl;
        return player;
    }

    public void update(String name, String firstName, String lastName, String nationality,
                       LocalDate birthDate, String height, String weight, String photoUrl) {
        this.name = name;
        this.firstName = firstName;
        this.lastName = lastName;
        this.nationality = nationality;
        this.birthDate = birthDate;
        this.height = height;
        this.weight = weight;
        this.photoUrl = photoUrl;
    }
}
