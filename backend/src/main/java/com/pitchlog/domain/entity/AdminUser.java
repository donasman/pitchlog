package com.pitchlog.domain.entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

/**
 * 어드민 계정.
 * role 은 현재 ADMIN 단일 값이지만, 이후 SUPER_ADMIN / EDITOR 등으로 확장 가능.
 */
@Entity
@Table(name = "admin_users", uniqueConstraints = {
        @UniqueConstraint(name = "uq_admin_users_username", columnNames = "username")
})
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class AdminUser {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 50)
    private String username;

    @Column(name = "password_hash", nullable = false, length = 100)
    private String passwordHash;

    @Column(nullable = false, length = 30)
    private String role;       // "ADMIN" | "SUPER_ADMIN" | …

    @Column(nullable = false)
    private boolean enabled = true;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    private void prePersist() {
        this.createdAt = LocalDateTime.now();
    }

    // ── 정적 팩토리 ────────────────────────────────────────────────
    public static AdminUser create(String username, String passwordHash, String role) {
        AdminUser u = new AdminUser();
        u.username     = username;
        u.passwordHash = passwordHash;
        u.role         = role;
        u.enabled      = true;
        return u;
    }

    // ── 변경 메서드 ────────────────────────────────────────────────
    public void changePassword(String newPasswordHash) {
        this.passwordHash = newPasswordHash;
    }

    public void changeRole(String role) {
        this.role = role;
    }

    public void setEnabled(boolean enabled) {
        this.enabled = enabled;
    }
}
