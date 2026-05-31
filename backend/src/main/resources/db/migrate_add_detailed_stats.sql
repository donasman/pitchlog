-- player_season_stats 상세 통계 컬럼 추가 마이그레이션
-- Railway PostgreSQL에 psql로 직접 실행하거나 Railway 콘솔에서 실행

ALTER TABLE player_season_stats
    ADD COLUMN IF NOT EXISTS lineups           INTEGER,
    ADD COLUMN IF NOT EXISTS minutes           INTEGER,
    ADD COLUMN IF NOT EXISTS saves             INTEGER,
    ADD COLUMN IF NOT EXISTS passes_total      INTEGER,
    ADD COLUMN IF NOT EXISTS passes_accuracy   INTEGER,
    ADD COLUMN IF NOT EXISTS shots_total       INTEGER,
    ADD COLUMN IF NOT EXISTS shots_on          INTEGER,
    ADD COLUMN IF NOT EXISTS dribbles_attempts INTEGER,
    ADD COLUMN IF NOT EXISTS dribbles_success  INTEGER,
    ADD COLUMN IF NOT EXISTS tackles_total     INTEGER,
    ADD COLUMN IF NOT EXISTS interceptions     INTEGER,
    ADD COLUMN IF NOT EXISTS duels_total       INTEGER,
    ADD COLUMN IF NOT EXISTS duels_won         INTEGER,
    ADD COLUMN IF NOT EXISTS fouls_committed   INTEGER,
    ADD COLUMN IF NOT EXISTS fouls_drawn       INTEGER;
