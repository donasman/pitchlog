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

-- Spring Batch 메타데이터 테이블은 spring.batch.jdbc.initialize-schema=always 로 자동 생성

-- 인덱스
CREATE INDEX IF NOT EXISTS idx_squad_entries_country ON squad_entries(country_id);
CREATE INDEX IF NOT EXISTS idx_player_season_stats_player ON player_season_stats(player_id);
CREATE INDEX IF NOT EXISTS idx_player_season_stats_goals ON player_season_stats(goals DESC NULLS LAST);
CREATE INDEX IF NOT EXISTS idx_player_season_stats_assists ON player_season_stats(assists DESC NULLS LAST);
