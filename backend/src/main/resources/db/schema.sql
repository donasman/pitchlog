-- PitchLog 데이터베이스 스키마
-- Railway PostgreSQL

CREATE TABLE IF NOT EXISTS countries (
    id          BIGSERIAL PRIMARY KEY,
    code        VARCHAR(10)  NOT NULL,
    name        VARCHAR(100) NOT NULL,
    flag_url    VARCHAR(500),
    group_name  VARCHAR(10),
    created_at  TIMESTAMP    NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMP    NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_countries_code UNIQUE (code)
);

CREATE TABLE IF NOT EXISTS players (
    id              BIGSERIAL PRIMARY KEY,
    api_player_id   INTEGER      NOT NULL,
    name            VARCHAR(100) NOT NULL,
    first_name      VARCHAR(50),
    last_name       VARCHAR(50),
    nationality     VARCHAR(100),
    birth_date      DATE,
    height          VARCHAR(20),
    weight          VARCHAR(20),
    photo_url       VARCHAR(500),
    created_at      TIMESTAMP    NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMP    NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_players_api_id UNIQUE (api_player_id)
);

CREATE TABLE IF NOT EXISTS player_season_stats (
    id              BIGSERIAL PRIMARY KEY,
    player_id       BIGINT       NOT NULL REFERENCES players(id),
    team_api_id     INTEGER      NOT NULL,
    team_name       VARCHAR(100),
    league_api_id   INTEGER      NOT NULL,
    league_name     VARCHAR(100),
    season_year     INTEGER      NOT NULL,
    appearances     INTEGER,
    goals           INTEGER,
    assists         INTEGER,
    yellow_cards    INTEGER,
    red_cards       INTEGER,
    rating          DECIMAL(4,2),
    updated_at      TIMESTAMP    NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_player_season_stats UNIQUE (player_id, team_api_id, league_api_id, season_year)
);

CREATE TABLE IF NOT EXISTS squad_entries (
    id              BIGSERIAL PRIMARY KEY,
    player_id       BIGINT       NOT NULL REFERENCES players(id),
    country_id      BIGINT       NOT NULL REFERENCES countries(id),
    jersey_number   INTEGER,
    position        VARCHAR(20),
    is_active       BOOLEAN      NOT NULL DEFAULT TRUE,
    updated_at      TIMESTAMP    NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_squad_entries UNIQUE (player_id, country_id)
);

CREATE TABLE IF NOT EXISTS matches (
    id                  BIGSERIAL PRIMARY KEY,
    fixture_id          INTEGER      UNIQUE,
    round               VARCHAR(100),
    match_date          TIMESTAMP,
    venue_name          VARCHAR(100),
    venue_city          VARCHAR(100),
    status_short        VARCHAR(10),
    status_long         VARCHAR(50),
    elapsed             INTEGER,
    home_team_api_id    INTEGER,
    home_team_name      VARCHAR(100),
    home_team_logo      VARCHAR(500),
    home_goals          INTEGER,
    away_team_api_id    INTEGER,
    away_team_name      VARCHAR(100),
    away_team_logo      VARCHAR(500),
    away_goals          INTEGER,
    group_name          VARCHAR(50),
    updated_at          TIMESTAMP    NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS match_lineup_entries (
    id              BIGSERIAL PRIMARY KEY,
    fixture_id      INTEGER      NOT NULL,
    team_api_id     INTEGER      NOT NULL,
    team_name       VARCHAR(100),
    formation       VARCHAR(20),
    player_api_id   INTEGER      NOT NULL,
    player_name     VARCHAR(100),
    player_number   INTEGER,
    pos             VARCHAR(3),
    grid            VARCHAR(10),
    is_substitute   BOOLEAN      NOT NULL DEFAULT FALSE,
    updated_at      TIMESTAMP    NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_match_lineup UNIQUE (fixture_id, player_api_id, team_api_id)
);

-- ── 어드민 계정 ────────────────────────────────────────────────────
-- role: ADMIN (일반 관리자) | SUPER_ADMIN (최고 관리자, 추후 확장)
CREATE TABLE IF NOT EXISTS admin_users (
    id            BIGSERIAL    PRIMARY KEY,
    username      VARCHAR(50)  NOT NULL,
    password_hash VARCHAR(100) NOT NULL,   -- BCrypt 해시
    role          VARCHAR(30)  NOT NULL DEFAULT 'ADMIN',
    enabled       BOOLEAN      NOT NULL DEFAULT TRUE,
    created_at    TIMESTAMP    NOT NULL DEFAULT NOW(),
    updated_at    TIMESTAMP    NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_admin_users_username UNIQUE (username)
);

-- Spring Batch 메타데이터 테이블은 spring.batch.jdbc.initialize-schema=always 로 자동 생성

-- 인덱스
CREATE INDEX IF NOT EXISTS idx_squad_entries_country ON squad_entries(country_id);
CREATE INDEX IF NOT EXISTS idx_player_season_stats_player ON player_season_stats(player_id);
CREATE INDEX IF NOT EXISTS idx_player_season_stats_goals ON player_season_stats(goals DESC NULLS LAST);
CREATE INDEX IF NOT EXISTS idx_player_season_stats_assists ON player_season_stats(assists DESC NULLS LAST);
CREATE INDEX IF NOT EXISTS idx_matches_match_date ON matches(match_date);
CREATE INDEX IF NOT EXISTS idx_match_lineup_fixture ON match_lineup_entries(fixture_id);
