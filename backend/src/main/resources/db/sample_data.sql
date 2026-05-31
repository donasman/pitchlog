-- =============================================================
-- PitchLog 파이프라인 검증용 샘플 데이터
-- 실행 순서: schema.sql → migrate_add_detailed_stats.sql → sample_data.sql
-- 로컬 또는 Railway psql에서 실행
-- =============================================================

-- 기존 샘플 데이터 초기화 (재실행 시 중복 방지)
TRUNCATE TABLE match_lineup_entries, matches, player_season_stats, squad_entries, players, countries
    RESTART IDENTITY CASCADE;

-- ── 1. 국가 ────────────────────────────────────────────────────────
INSERT INTO countries (code, name, flag_url, group_name) VALUES
    ('KOR', '대한민국',   'https://media.api-sports.io/flags/kr.svg', 'B'),
    ('BRA', 'Brazil',     'https://media.api-sports.io/flags/br.svg', 'A'),
    ('FRA', 'France',     'https://media.api-sports.io/flags/fr.svg', 'C'),
    ('ESP', 'Spain',      'https://media.api-sports.io/flags/es.svg', 'D'),
    ('ARG', 'Argentina',  'https://media.api-sports.io/flags/ar.svg', 'E'),
    ('ENG', 'England',    'https://media.api-sports.io/flags/gb-eng.svg', 'F');

-- ── 2. 선수 (api_player_id는 실제 API-Football ID와 동일하게 맞출 것) ──
INSERT INTO players (api_player_id, name, first_name, last_name, nationality, birth_date, height, weight, photo_url) VALUES
    -- 대한민국
    (2018,  '손흥민',        'Heung-Min', 'Son',      '대한민국', '1992-07-08', '183 cm', '77 kg', 'https://media.api-sports.io/football/players/2018.png'),
    (49298, '이강인',        'Kang-in',   'Lee',      '대한민국', '2001-02-19', '173 cm', '69 kg', 'https://media.api-sports.io/football/players/49298.png'),
    (47387, '김민재',        'Min-Jae',   'Kim',      '대한민국', '1996-11-15', '190 cm', '86 kg', 'https://media.api-sports.io/football/players/47387.png'),
    -- 브라질
    (174,   'Vinicius Jr.', 'Vinicius',  'Junior',   'Brazil',   '2000-07-12', '176 cm', '73 kg', 'https://media.api-sports.io/football/players/174.png'),
    (1444,  'Rodrygo',      'Rodrygo',   'Goes',     'Brazil',   '2001-01-09', '174 cm', '64 kg', 'https://media.api-sports.io/football/players/1444.png'),
    -- 프랑스
    (278,   'Kylian Mbappé','Kylian',    'Mbappé',   'France',   '1998-12-20', '178 cm', '73 kg', 'https://media.api-sports.io/football/players/278.png'),
    (521,   'Antoine Griezmann','Antoine','Griezmann','France',  '1991-03-21', '176 cm', '73 kg', 'https://media.api-sports.io/football/players/521.png'),
    -- 스페인
    (284890,'Lamine Yamal', 'Lamine',    'Yamal',    'Spain',    '2007-07-13', '180 cm', '73 kg', 'https://media.api-sports.io/football/players/284890.png'),
    (154,   'Pedri',        'Pedro',     'González', 'Spain',    '2002-11-25', '174 cm', '60 kg', 'https://media.api-sports.io/football/players/154.png'),
    -- 아르헨티나
    (154,   'Lionel Messi', 'Lionel',    'Messi',    'Argentina','1987-06-24', '169 cm', '67 kg', 'https://media.api-sports.io/football/players/154.png'),
    -- 잉글랜드
    (184,   'Harry Kane',   'Harry',     'Kane',     'England',  '1993-07-28', '188 cm', '86 kg', 'https://media.api-sports.io/football/players/184.png');

-- ── 3. 스쿼드 엔트리 ────────────────────────────────────────────────
INSERT INTO squad_entries (player_id, country_id, jersey_number, position, is_active) VALUES
    -- 대한민국 (country_id=1)
    ((SELECT id FROM players WHERE api_player_id=2018),  (SELECT id FROM countries WHERE code='KOR'), 7,  'FWD', true),
    ((SELECT id FROM players WHERE api_player_id=49298), (SELECT id FROM countries WHERE code='KOR'), 17, 'MID', true),
    ((SELECT id FROM players WHERE api_player_id=47387), (SELECT id FROM countries WHERE code='KOR'), 3,  'DEF', true),
    -- 브라질 (country_id=2)
    ((SELECT id FROM players WHERE api_player_id=174),   (SELECT id FROM countries WHERE code='BRA'), 7,  'FWD', true),
    ((SELECT id FROM players WHERE api_player_id=1444),  (SELECT id FROM countries WHERE code='BRA'), 11, 'FWD', true),
    -- 프랑스 (country_id=3)
    ((SELECT id FROM players WHERE api_player_id=278),   (SELECT id FROM countries WHERE code='FRA'), 10, 'FWD', true),
    ((SELECT id FROM players WHERE api_player_id=521),   (SELECT id FROM countries WHERE code='FRA'), 7,  'FWD', true),
    -- 스페인 (country_id=4)
    ((SELECT id FROM players WHERE api_player_id=284890),(SELECT id FROM countries WHERE code='ESP'), 11, 'FWD', true),
    ((SELECT id FROM players WHERE api_player_id=154),   (SELECT id FROM countries WHERE code='ESP'), 8,  'MID', true),
    -- 아르헨티나 (country_id=5)  ← Messi는 api_player_id=154 충돌 문제로 별도 처리 필요
    -- 잉글랜드 (country_id=6)
    ((SELECT id FROM players WHERE api_player_id=184),   (SELECT id FROM countries WHERE code='ENG'), 9,  'FWD', true);

-- ── 4. 시즌 통계 (2025-26 시즌) ───────────────────────────────────
-- appearances, lineups, minutes, goals, assists, saves,
-- yellow_cards, red_cards, rating,
-- passes_total, passes_accuracy, shots_total, shots_on,
-- dribbles_attempts, dribbles_success, tackles_total, interceptions,
-- duels_total, duels_won, fouls_committed, fouls_drawn
INSERT INTO player_season_stats
    (player_id, team_api_id, team_name, league_api_id, league_name, season_year,
     appearances, lineups, minutes, goals, assists, saves,
     yellow_cards, red_cards, rating,
     passes_total, passes_accuracy, shots_total, shots_on,
     dribbles_attempts, dribbles_success, tackles_total, interceptions,
     duels_total, duels_won, fouls_committed, fouls_drawn)
VALUES
    -- 손흥민 (Tottenham / Premier League)
    ((SELECT id FROM players WHERE api_player_id=2018), 47, 'Tottenham', 39, 'Premier League', 2025,
     34, 32, 2760, 18, 9, NULL, 3, 0, 7.85,
     980, 78, 112, 55, 145, 98, 22, 8, 280, 145, 38, 52),

    -- 이강인 (PSG / Ligue 1)
    ((SELECT id FROM players WHERE api_player_id=49298), 85, 'PSG', 61, 'Ligue 1', 2025,
     30, 26, 2180, 8, 14, NULL, 4, 0, 7.62,
     1450, 87, 72, 31, 190, 132, 35, 18, 310, 168, 55, 78),

    -- 김민재 (Bayern / Bundesliga)
    ((SELECT id FROM players WHERE api_player_id=47387), 157, 'Bayern Munich', 78, 'Bundesliga', 2025,
     28, 28, 2490, 2, 1, NULL, 5, 1, 7.41,
     1820, 91, 18, 6, 25, 14, 118, 62, 340, 192, 48, 30),

    -- Vinicius Jr. (Real Madrid / La Liga)
    ((SELECT id FROM players WHERE api_player_id=174), 541, 'Real Madrid', 140, 'La Liga', 2025,
     32, 30, 2590, 22, 11, NULL, 6, 1, 8.21,
     890, 82, 138, 68, 215, 152, 18, 6, 298, 162, 62, 95),

    -- Mbappé (Real Madrid / La Liga)
    ((SELECT id FROM players WHERE api_player_id=278), 541, 'Real Madrid', 140, 'La Liga', 2025,
     35, 35, 3060, 31, 8, NULL, 4, 0, 8.45,
     820, 80, 162, 82, 188, 128, 15, 4, 260, 138, 42, 88),

    -- Harry Kane (Bayern / Bundesliga)
    ((SELECT id FROM players WHERE api_player_id=184), 157, 'Bayern Munich', 78, 'Bundesliga', 2025,
     33, 33, 2890, 28, 12, NULL, 3, 0, 8.18,
     740, 77, 148, 74, 98, 58, 20, 5, 285, 148, 55, 70);

-- ── 5. 경기 일정 ────────────────────────────────────────────────────
INSERT INTO matches
    (fixture_id, round, match_date, venue_name, venue_city,
     status_short, status_long, elapsed,
     home_team_api_id, home_team_name, home_team_logo, home_goals,
     away_team_api_id, away_team_name, away_team_logo, away_goals,
     group_name)
VALUES
    -- 예정 경기
    (900001, 'Group Stage - 1', '2026-06-12 19:00:00', 'MetLife Stadium',     'New York',    'NS', 'Not Started', NULL, 47,  '대한민국', 'https://media.api-sports.io/flags/kr.svg', NULL, 541, 'Brazil',    'https://media.api-sports.io/flags/br.svg', NULL, 'A'),
    (900002, 'Group Stage - 1', '2026-06-13 22:00:00', 'SoFi Stadium',        'Los Angeles', 'NS', 'Not Started', NULL, 80,  'France',   'https://media.api-sports.io/flags/fr.svg', NULL, 9,   'Spain',     'https://media.api-sports.io/flags/es.svg', NULL, 'C'),
    (900003, 'Group Stage - 1', '2026-06-14 19:00:00', 'AT&T Stadium',        'Dallas',      'NS', 'Not Started', NULL, 26,  'Argentina','https://media.api-sports.io/flags/ar.svg', NULL, 10,  'England',   'https://media.api-sports.io/flags/gb-eng.svg', NULL, 'E'),
    -- 종료 경기 (스코어 있음)
    (900004, 'Friendly',        '2026-05-28 18:00:00', 'Wembley Stadium',     'London',      'FT', 'Match Finished', NULL, 10, 'England', 'https://media.api-sports.io/flags/gb-eng.svg', 2, 80, 'France',   'https://media.api-sports.io/flags/fr.svg', 1, NULL),
    (900005, 'Friendly',        '2026-05-29 20:00:00', 'Santiago Bernabéu',   'Madrid',      'FT', 'Match Finished', NULL, 541,'Brazil',  'https://media.api-sports.io/flags/br.svg',     3, 9,  'Spain',    'https://media.api-sports.io/flags/es.svg', 2, NULL);

-- ── 6. 경기 라인업 (900004 잉글랜드 vs 프랑스) ───────────────────────
INSERT INTO match_lineup_entries
    (fixture_id, team_api_id, team_name, formation, player_api_id, player_name, player_number, pos, grid, is_substitute)
VALUES
    -- 잉글랜드 선발
    (900004, 10, 'England', '4-3-3', 184, 'Harry Kane',    9,  'F', '1:2', false),
    -- 프랑스 선발
    (900004, 80, 'France',  '4-3-3', 278, 'Kylian Mbappé', 10, 'F', '1:2', false),
    (900004, 80, 'France',  '4-3-3', 521, 'Griezmann',     7,  'F', '1:1', false);

SELECT 'Sample data inserted successfully' AS result;
